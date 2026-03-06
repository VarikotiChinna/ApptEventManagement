import { useState, useEffect } from 'react'
import { AllCommunityModule } from 'ag-grid-community'
import { AgGridProvider, AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'
import * as XLSX from 'xlsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExcel } from '@fortawesome/free-solid-svg-icons'

function DashboardContent() {
  const [registrations, setRegistrations] = useState([])
  const [totalContribution, setTotalContribution] = useState(0)

  useEffect(() => {
    fetchRegistrations()
  }, [])

  const fetchRegistrations = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'eventRegistrations'))
      const data = []
      let total = 0
      
      querySnapshot.forEach((doc) => {
        const regData = doc.data()
        data.push({
          id: doc.id,
          event: regData.event,
          flatNumber: regData.flatNumber,
          residentName: regData.residentName,
          mobile: regData.mobile,
          adults: regData.adults,
          kids: regData.kids,
          foodPreference: regData.foodPreference,
          contribution: regData.contribution,
          paymentMode: regData.paymentMode,
          transactionId: regData.transactionId || '',
          comments: regData.comments || '',
          registeredAt: regData.registeredAt?.toDate().toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) || ''
        })
        total += regData.contribution || 0
      })
      
      setRegistrations(data)
      setTotalContribution(total)
    } catch (error) {
      console.error('Error fetching registrations:', error)
    }
  }

  const columnDefs = [
    { field: 'flatNumber', headerName: 'Flat No', sortable: true, filter: true, width: 100 },
    { field: 'residentName', headerName: 'Resident Name', sortable: true, filter: true, width: 150 },
    { field: 'mobile', headerName: 'Mobile', sortable: true, filter: true, width: 120 },
    { field: 'event', headerName: 'Event', sortable: true, filter: true, width: 150 },
    { field: 'adults', headerName: 'Adults', sortable: true, filter: true, width: 80 },
    { field: 'kids', headerName: 'Kids', sortable: true, filter: true, width: 70 },
    { field: 'foodPreference', headerName: 'Food', sortable: true, filter: true, width: 90 },
    { field: 'contribution', headerName: 'Amount (₹)', sortable: true, filter: true, width: 110 },
    { field: 'paymentMode', headerName: 'Payment', sortable: true, filter: true, width: 120 },
    { field: 'transactionId', headerName: 'Transaction ID', sortable: true, filter: true, width: 140 },
    { field: 'comments', headerName: 'Comments', sortable: true, filter: true, width: 180 },
    { field: 'registeredAt', headerName: 'Registered On', sortable: true, filter: true, width: 160 }
  ]

  const defaultColDef = {
    flex: 1,
    resizable: true,
    sortable: true,
    filter: true
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(registrations)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Event Registrations')
    XLSX.writeFile(workbook, `Event_Registrations_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  return (
    <div style={{ padding: 20, height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <h1 style={styles.title}>Dashboard</h1>
      
      <div style={styles.widgets}>
        <div style={styles.widget}>
          <h3 style={styles.widgetTitle}>📅 Upcoming Events</h3>
          <div style={styles.widgetContent}>
            <p style={styles.eventItem}>• Annual Day - Dec 25, 2026</p>
            <p style={styles.eventItem}>• Yoga Session - Dec 28, 2026</p>
            <p style={styles.eventItem}>• New Year Party - Dec 31, 2026</p>
          </div>
        </div>

        <div style={styles.widget}>
          <h3 style={styles.widgetTitle}>👍 Interest Shown</h3>
          <div style={styles.widgetContent}>
            <p style={styles.eventItem}>• Annual Day: 45 residents</p>
            <p style={styles.eventItem}>• Yoga Session: 23 residents</p>
            <p style={styles.eventItem}>• New Year Party: 67 residents</p>
          </div>
        </div>

        <div style={styles.widget}>
          <h3 style={styles.widgetTitle}>🏋️ Amenities Status</h3>
          <div style={styles.widgetContent}>
            <p style={styles.eventItem}>• Clubhouse: Available</p>
            <p style={styles.eventItem}>• Gym: Booked (6 PM - 8 PM)</p>
            <p style={styles.eventItem}>• Party Hall: Available</p>
          </div>
        </div>

        <div style={styles.widget}>
          <h3 style={styles.widgetTitle}>🗳️ Active Polls</h3>
          <div style={styles.widgetContent}>
            <p style={styles.eventItem}>• Security Upgrade: 78% Yes</p>
            <p style={styles.eventItem}>• Garden Renovation: Ongoing</p>
          </div>
        </div>
      </div>

      <div style={{ ...styles.gridSection, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={styles.gridHeader}>
          <h2 style={styles.gridTitle}>Event Registrations</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <p style={styles.totalContribution}>
              Total: ₹{totalContribution.toLocaleString()}
            </p>
            <button style={styles.exportButton} onClick={exportToExcel} title="Export to Excel">
              <FontAwesomeIcon icon={faFileExcel} size="lg" color="#fff" />
            </button>
          </div>
        </div>

        <AgGridProvider modules={[AllCommunityModule]}>
          <div className="ag-theme-alpine" style={{ flex: 1, width: '100%' }}>
            <AgGridReact
              rowData={registrations}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={10}
            />
          </div>
        </AgGridProvider>
      </div>
    </div>
  )
}

const styles = {
  container: {
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24
  },
  widgets: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 20
  },
  widget: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    minWidth: 250,
    flex: 1,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  widgetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12
  },
  widgetContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },
  eventItem: {
    fontSize: 13,
    color: '#666',
    lineHeight: '20px',
    margin: 0
  },
  gridSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  gridHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  gridTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
    margin: 0
  },
  totalContribution: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#04AA6D',
    margin: 0
  },
  exportButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#04AA6D',
    padding: '10px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    width: '40px',
    height: '40px'
  }
}

export default DashboardContent
