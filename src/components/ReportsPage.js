import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReports, addReport, updateReport, removeReport } from '../actions/reports';
import EstablishmentHistorySearch from './EstablishmentHistorySearch';
import JsPDF from 'jspdf';
import 'jspdf-autotable';
import io from 'socket.io-client';
import {
  CircularProgress, Alert, Box, Button, Container, MenuItem, Select, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Card, CardContent, Grid
} from '@mui/material';

const socket = io('http://localhost:8080');

const ReportsPage = () => {
  const dispatch = useDispatch();
  const { data: reports, loading, error } = useSelector(state => state.reports || { data: [], loading: false, error: null });
  const [year, setYear] = useState(new Date().getFullYear());
  const [listType, setListType] = useState('Positive');

  useEffect(() => {
    dispatch(fetchReports(listType, year));

    socket.on('ADD_REPORT', (report) => {
      dispatch(addReport(report));
    });

    socket.on('UPDATE_REPORT', (report) => {
      dispatch(updateReport(report));
    });

    socket.on('REMOVE_REPORT', (reportId) => {
      dispatch(removeReport(reportId));
    });

    // Subscribe to real-time updates from the server
    socket.emit('subscribeToReports', { listType, year });

    // Cleanup on component unmount
    return () => {
      socket.off('ADD_REPORT');
      socket.off('UPDATE_REPORT');
      socket.off('REMOVE_REPORT');
    };
  }, [dispatch, listType, year]);


  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

  const handleYearChange = (event) => setYear(event.target.value);
  const handleListTypeChange = (event) => setListType(event.target.value);


  const generatePDF = () => {
    const doc = new JsPDF();
    doc.text(`Annual Records Report - ${year} - ${listType}`, 14, 16);
  
    const headers = listType === 'Positive'
      ? [['Trade Name', 'Unique Number', 'Owner', 'Address', 'Type of Occupancy', 'Inspection Date', 'Registration Date', 'OR Number', 'Certification Amount', 'Release Date', 'Certification Status']]
      : [['Trade Name', 'Unique Number', 'Owner', 'Address', 'Type of Occupancy', 'Inspection Date', 'Defects and Deficiencies']];
  
    // Check each report before trying to access its properties
    const body = reports.reduce((acc, report) => {
      if (report && report.establishment) {
        const baseData = [
          report.establishment.tradeName,
          report.establishment.uniqueNumber,
          report.establishment.ownerRepresentative,
          report.establishment.address,
          report.establishment.typeOfOccupancy,
        ];
  
        const row = listType === 'Positive'
          ? [...baseData, formatDate(report.inspectionDate), formatDate(report.registrationDate), report.orNumber, report.certificationAmount, formatDate(report.releaseDate), report.certificationStatus]
          : [...baseData, formatDate(report.inspectionDate), report.defectsDeficiencies];
        
        acc.push(row);
      }
      return acc;
    }, []);
  
    doc.autoTable({
      startY: 22,
      theme: 'striped',
      headStyles: { fillColor: [22, 160, 133] },
      styles: { fontSize: 8, cellPadding: 1 },
      head: headers,
      body: body,
      columnStyles: { 0: { cellWidth: 'auto' }, 1: { cellWidth: 'auto' } },
    });
  
    doc.save(`annual_records_${year}_${listType}.pdf`);
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Annual Records Report
      </Typography>
      <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Select value={year} onChange={handleYearChange} sx={{ mb: 2, minWidth: 120 }}>
              {Array.from({ length: 5 }, (_, i) => (
                <MenuItem key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</MenuItem>
              ))}
            </Select>
            <Select value={listType} onChange={handleListTypeChange} sx={{ mb: 2, minWidth: 120 }}>
              <MenuItem value="Positive">Positive</MenuItem>
              <MenuItem value="Negative">Negative</MenuItem>
            </Select>
            <Button variant="contained" color="primary" onClick={generatePDF} disabled={reports.length === 0} sx={{ mb: 2 }}>
              Generate PDF
            </Button>
            </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <EstablishmentHistorySearch />
        </Grid>
      </Grid>
      
      {loading ? (
        <Typography sx={{ mt: 2 }}>Loading...</Typography>
    ) : (
        <TableContainer component={Paper}>
          <Table aria-label="reports table">
            <TableHead>
              <TableRow>
                <TableCell>Trade Name</TableCell>
                <TableCell>Unique Number</TableCell>
                <TableCell>Owner Representative</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Type of Occupancy</TableCell>
                {listType === 'Positive' ? (
                  <>
                    <TableCell>Inspection Date</TableCell>
                    <TableCell>Registration Date</TableCell>
                    <TableCell>OR Number</TableCell>
                    <TableCell>Certification Amount</TableCell>
                    <TableCell>Release Date</TableCell>
                    <TableCell>Certification Status</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>Inspection Date</TableCell>
                    <TableCell>Defects and Deficiencies</TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {reports
                .filter(report => report && report.establishment) // Only include reports with establishment data
                .map((report) => (
                  <TableRow key={report._id}>
                  <TableCell>{report.establishment.tradeName}</TableCell>
                  <TableCell>{report.establishment.uniqueNumber}</TableCell>
                  <TableCell>{report.establishment.ownerRepresentative}</TableCell>
                  <TableCell>{report.establishment.address}</TableCell>
                  <TableCell>{report.establishment.typeOfOccupancy}</TableCell>
                  {listType === 'Positive' ? (
                    <>
                      <TableCell>{formatDate(report.inspectionDate)}</TableCell>
                      <TableCell>{formatDate(report.registrationDate)}</TableCell>
                      <TableCell>{report.orNumber}</TableCell>
                      <TableCell>{report.certificationAmount}</TableCell>
                      <TableCell>{formatDate(report.releaseDate)}</TableCell>
                      <TableCell>{report.certificationStatus}</TableCell>
                    </>
                ) : (
                  <>
                      <TableCell>{formatDate(report.inspectionDate)}</TableCell>
                      <TableCell>{report.defectsDeficiencies}</TableCell>
                  </>
                )}
              </TableRow>
            ))
          }
        {reports.length === 0 && (
          <TableRow>
            <TableCell colSpan={listType === 'Positive' ? 11 : 7} align="center">
              No records found
            </TableCell>
          </TableRow>
        )}
        </TableBody>

          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default ReportsPage;

