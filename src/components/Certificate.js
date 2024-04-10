// Certificate.js
import React, { useState } from 'react';
import { Grid, Card, CardActionArea, CardContent, Typography, Modal, Box } from '@mui/material';
import CertificateForm from './CertificateForm';

// Define your PDF templates and respective fields as per your backend
const pdfTemplates = [
  {
    id: 'FSED-32F',
    title: 'Installation of Building-Service-Equipment',
    fields: [
      'fscibseNoR',
      'date',
      'buildingName',
      'address',
      'ownerName',
      'installerCompany',
      'amountPaid',
      'orNumber',
      'paymentDate',
      'chiefFses',
      'fireMarshal',
    ],
  },
  {
    id: 'FSED-35F',
    title: 'Operation of Dust Producing Machines',
    fields: [
      'fscibseNoR',
      'date',
      'buildingName',
      'address',
      'ownerName',
      'installerCompany',
      'validUntil',
      'month',
      'year',
      'amountPaid',
      'orNumber',
      'paymentDate',
      'recommendApproval',
      'approvedBy',
    ],
  },
  {
    id: 'FSED-47F',
    title: 'Selling of Fire Crackers and Pyrothecnics',
    fields: [
      'fscibseNoR',
      'date',
      'buildingName',
      'address',
      'ownerName',
      'dayStart',
      'dayEnd',
      'amountPaid',
      'orNumber',
      'paymentDate',
      'recommendApproval',
      'approvedBy',
    ],
  },
  {
    id: 'FSED-36F',
    title: 'Installation of LPGAS System',
    fields: [
      'fscibseNoR',
      'date',
      'tradeName',
      'address',
      'ownerRepresentative',
      'companyInstaller',
      'appliancesInstalled',
      'dateInstalled',
      'mechanicanicalEngineer',
      'PRCIDNo',
      'AmountPaid',
      'orNumber',
      'paymentDate',
      'ChiefFSES',
      'CityMunicipalFireMarshal',
    ],
  },
  {
    id: 'FSED-038F',
    title: 'Convenyance of Hazardous Materials and Chemicals in Cargo Vehicles',
    fields: [
      'fscibseNoR',
      'date',
      'tradeName',
      'address',
      'TypeofVehicle',
      'PlateNumber',
      'MotorNumber',
      'ChassisNumber',
      'NameOfDriver',
      'LicenseNumber',
      'TrailerNumber',
      'Capacity',
      'ValidUntil',
      'AmountPaid',
      'orNumber',
      'paymentDate',
      'ChiefFSES',
      'CityMunicipalFireMarshal',
    ],
  },
  {
    id: 'FSED-39F',
    title: 'Electrical Installation',
    fields: [
      'fscibseNoR',
      'date',
      'tradeName',
      'ownerRepresentative',
      'address',
      'Voltage',
      'NoOfPhase',
      'TotalConnectedLoad',
      'MainCircuitBreaker',
      'InstalledBy',
      'PRCLicenseNumber',
      'ValidUntil',
      'AmountPaid',
      'ORNumber',
      'paymentDate',
      'ChiefFSES',
      'CityMunicipalFireMarshal',
    ],
  },
  {
    id: 'FSED-40F',
    title: 'Fireworks Exhibition',
    fields: [
      'fscibseNoR',
      'date',
      'ContructorName',
      'address',
      'NameOfOwner',
      'DateConducted',
      'DurationOfExhibition',
      'SupervisedBy',
      'ValidUntil',
      'AmountPaid',
      'orNumber',
      'paymentDate',
      'ChiefFSES',
      'CityMunicipalFireMarshal',
    ],
  },
  {
    id: 'FSED-42F',
    title: 'Kitchen Hood Supression Systems',
    fields: [
      'fscibseNoR',
      'date',
      'tradeName',
      'address',
      'ownerRepresentative',
      'BusinessOperationAs',
      'InstalledBy',
      'AmountPaid',
      'orNumber',
      'paymentDate', 
      'ChiefFSES',
      'CityMunicipalFireMarshal',
    ],
  }
];


const Certificate = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [formData, setFormData] = useState({});

  // Function to open the modal and set the active template
  const handleOpen = (template) => {
    setActiveTemplate(template);
    setFormData({}); // Reset the form data
    setModalOpen(true);
  };

  // Function to close the modal
  const handleClose = () => {
    setModalOpen(false);
  };

  // Function to update form data as user enters values
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Function to submit form data to the backend and handle the PDF response
  const handleSubmit = async () => {
    // The URL should match your backend route
    const endpoint = `http://localhost:5000/pdf/fill-pdf/${activeTemplate.id}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include other headers as needed, like authorization
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${activeTemplate.title}.pdf`; // Set the download file name
        link.click();
        window.URL.revokeObjectURL(downloadUrl);
      } else {
        console.error('Response not OK:', response);
      }
    } catch (error) {
      console.error('Error during fetch:', error);
    } finally {
      setModalOpen(false); // Close the modal regardless of the outcome
    }
  };

  const handleFetchEstablishment = async (tradeName) => {
    try {
      const response = await fetch(`/api/establishments/search?tradeName=${encodeURIComponent(tradeName)}`, {
        method: 'GET', // Adjust if your method is different
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          const establishment = data[0]; // Assuming the first result is the one you want
          setFormData({
            ...formData,
            address: establishment.address,
            ownerName: establishment.ownerRepresentative,
            // Add more fields as needed
          });
        }
      } else {
        console.error('Failed to fetch establishment data');
      }
    } catch (error) {
      console.error('Error fetching establishment data:', error);
    }
  };
  



  return (
  <Box sx={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start', // Align to the top
    alignItems: 'center',
    minHeight: '100vh', // This will take the full height of the viewport
    pt: 4, // Add padding at the top
  }}>
    <Typography variant="h4" gutterBottom sx={{ color: '#021024', textAlign: 'center', width: '100%', mt: 2, mb: 4 }}>
      Fire Safety Clearance Certificates
    </Typography>

    <Grid container spacing={2} justifyContent="center">
      {pdfTemplates.map((template) => (
          <Grid item key={template.id} xs={12} sm={6} md={4} lg={3}>
            <Card sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: 140, // Adjust height as needed
              backgroundColor: '#021024',
              color: '#fff',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
              borderRadius: '10px',
              margin: 'auto',
              maxWidth: 300,
              '&:hover': {
                boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.3)',
              },
              overflow: 'hidden',
              position: 'relative',
              '&:before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'linear-gradient(145deg, transparent 30%, rgba(255, 255, 255, 0.3) 70%)',
                borderRadius: '10px',
              },
              '& .MuiCardContent-root': {
                position: 'relative',
                zIndex: 1,
              },
            }}>
              <CardActionArea onClick={() => handleOpen(template)}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div" sx={{ textAlign: 'center', fontSize: '0.875rem' }}>
                    {template.title}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Modal
        open={modalOpen}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <CertificateForm
          activeTemplate={activeTemplate}
          formData={formData}
          setFormData={setFormData} // Now passing setFormData down to CertificateForm
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleFetchEstablishment={handleFetchEstablishment} // Passing the new function to CertificateForm
        />
    </Modal>
    </Box>
  );
};

export default Certificate;