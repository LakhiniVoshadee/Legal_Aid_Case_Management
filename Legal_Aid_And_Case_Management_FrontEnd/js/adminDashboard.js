$(document).ready(function() {
  const token = localStorage.getItem('token'); // Replace with your JWT token retrieval method
  let lawyers = [];
  let clients = [];
  let cases = [];
  let appointments = []; // Store appointments data
  let adminEmail = localStorage.getItem('adminEmail') || 'admin@example.com'; // Placeholder; ideally fetched from backend

  // Set current date
  const currentDate = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  $('#current-date').text(currentDate.toLocaleDateString('en-US', options));

  // Sidebar toggle
  $('#sidebarCollapse').on('click', function() {
    $('#sidebar').toggleClass('active');
    $('#content').toggleClass('active');
  });

  // Navigation
  $('#dashboard-link').click(function(e) {
    e.preventDefault();
    activateSection('dashboard');
    updateDashboardStats();
  });

  $('#lawyers-nav-link').click(function(e) {
    e.preventDefault();
    activateSection('lawyers');
    loadLawyers();
  });

  $('#clients-nav-link').click(function(e) {
    e.preventDefault();
    activateSection('clients');
    loadClients();
  });

  $('#cases-nav-link').click(function(e) {
    e.preventDefault();
    activateSection('cases');
    $('#assign-result').text('');
    updateCaseAssignmentCharts();
  });

  $('#all-cases-nav-link').click(function(e) {
    e.preventDefault();
    activateSection('all-cases');
    loadAllCases();
  });

  $('#appointments-nav-link').click(function(e) {
    e.preventDefault();
    activateSection('appointments');
    loadAppointments();
  });

  $('#profile-nav-link').click(function(e) {
    e.preventDefault();
    activateSection('profile');
    loadAdminProfile();
  });

  function activateSection(section) {
    $('.content-section').removeClass('active');
    $(`#${section}-content`).addClass('active');

    // Update sidebar active state
    $('#sidebar ul li').removeClass('active');
    $(`#sidebar ul li a[href="#${section}"]`).parent().addClass('active');
  }

  // Function to load admin profile
  function loadAdminProfile() {
    if (!token) {
      $('#profile-result').removeClass('success').addClass('error').text('Please log in to view profile.');
      return;
    }

    $('#profile-result').text('');
    $('#adminName').val('');
    $('#profilePicturePreview').hide();
    $('#deleteProfilePicture').hide();

    // Placeholder: Fetch admin details (since no endpoint is provided, assume data is fetched)
    $.ajax({
      url: 'http://localhost:8080/api/v1/user/search/' + adminEmail, // Hypothetical endpoint
      type: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function(response) {
        if (response && response.code === 200 && response.data) {
          $('#adminName').val(response.data.admin_name || 'Admin');
          $('#navbar-admin-name').text(response.data.admin_name || 'Admin');
          if (response.data.profilePictureUrl) {
            $('#profilePicturePreview').attr('src', response.data.profilePictureUrl).show();
            $('#deleteProfilePicture').show();
            $('#navbar-profile-pic').attr('src', response.data.profilePictureUrl);
          } else {
            $('#profilePicturePreview').attr('src', 'https://via.placeholder.com/150').hide();
            $('#navbar-profile-pic').attr('src', 'https://via.placeholder.com/36');
          }
        } else {
          $('#profile-result').removeClass('success').addClass('error').text('Unable to load profile.');
        }
      },
      error: function(xhr) {
        $('#profile-result').removeClass('success').addClass('error').text('Error loading profile.');
        console.error('Error loading admin profile:', xhr);
      }
    });
  }

  // Function to update admin profile
  function updateAdminProfile(adminName) {
    if (!token) {
      $('#profile-result').removeClass('success').addClass('error').text('Please log in to update profile.');
      return;
    }

    $.ajax({
      url: 'http://localhost:8080/api/v1/user/update-admin',
      type: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({ admin_name: adminName }),
      success: function(response) {
        if (response && response.code === 200) {
          $('#profile-result').removeClass('error').addClass('success').text(response.message);
          $('#navbar-admin-name').text(adminName);
        } else {
          $('#profile-result').removeClass('success').addClass('error').text('Unexpected response from server.');
        }
      },
      error: function(xhr) {
        const errorMsg = xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : 'Error updating profile.';
        $('#profile-result').removeClass('success').addClass('error').text(errorMsg);
        console.error('Error updating admin profile:', xhr);
      }
    });
  }

  // Function to upload profile picture
  function uploadProfilePicture(file) {
    if (!token) {
      $('#profile-result').removeClass('success').addClass('error').text('Please log in to upload picture.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    $.ajax({
      url: `http://localhost:8080/api/v1/user/${adminEmail}/profile-picture`,
      type: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      data: formData,
      processData: false,
      contentType: false,
      success: function(response) {
        if (response && response.profilePictureUrl) {
          $('#profilePicturePreview').attr('src', response.profilePictureUrl).show();
          $('#navbar-profile-pic').attr('src', response.profilePictureUrl);
          $('#deleteProfilePicture').show();
          $('#profile-result').removeClass('error').addClass('success').text('Profile picture updated successfully.');
        } else {
          $('#profile-result').removeClass('success').addClass('error').text('Unexpected response from server.');
        }
      },
      error: function(xhr) {
        const errorMsg = xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : 'Error uploading picture.';
        $('#profile-result').removeClass('success').addClass('error').text(errorMsg);
        console.error('Error uploading profile picture:', xhr);
      }
    });
  }

  // Function to delete profile picture
  function deleteProfilePicture() {
    if (!token) {
      $('#profile-result').removeClass('success').addClass('error').text('Please log in to delete picture.');
      return;
    }

    $.ajax({
      url: `http://localhost:8080/api/v1/user/${adminEmail}/profile-picture`,
      type: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function() {
        $('#profilePicturePreview').attr('src', 'https://via.placeholder.com/150').hide();
        $('#navbar-profile-pic').attr('src', 'https://via.placeholder.com/36');
        $('#deleteProfilePicture').hide();
        $('#profile-result').removeClass('error').addClass('success').text('Profile picture deleted successfully.');
      },
      error: function(xhr) {
        const errorMsg = xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : 'Error deleting picture.';
        $('#profile-result').removeClass('success').addClass('error').text(errorMsg);
        console.error('Error deleting profile picture:', xhr);
      }
    });
  }

  // Handle profile form submission
  $('#admin-profile-form').submit(function(e) {
    e.preventDefault();
    const adminName = $('#adminName').val();
    const file = $('#profilePicture')[0].files[0];

    updateAdminProfile(adminName);

    if (file) {
      uploadProfilePicture(file);
    }
  });

  // Handle delete profile picture button
  $('#deleteProfilePicture').click(function() {
    if (confirm('Are you sure you want to delete your profile picture?')) {
      deleteProfilePicture();
    }
  });

  // Preview profile picture on file select
  $('#profilePicture').change(function() {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        $('#profilePicturePreview').attr('src', e.target.result).show();
      };
      reader.readAsDataURL(file);
    }
  });

  // Function to load lawyers
  function loadLawyers() {
    if (!token) {
      $('#lawyers-tbody').html('<tr><td colspan="10" class="text-center text-danger">Please log in to view data.</td></tr>');
      return;
    }

    $('#lawyers-loading').show();
    $('#lawyers-tbody').empty();

    $.ajax({
      url: 'http://localhost:8080/api/v1/dashboard/lawyers-byAdmin',
      type: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function(response) {
        $('#lawyers-loading').hide();
        if (response && response.code === 200 && response.data) {
          lawyers = response.data;
          lawyers.forEach(function(lawyer) {
            const row = `
              <tr>
                <td>${lawyer.lawyer_name || 'N/A'}</td>
                <td>${lawyer.specialization || 'N/A'}</td>
                <td>${lawyer.yearsOfExperience || 'N/A'}</td>
                <td>${lawyer.officeLocation || 'N/A'}</td>
                <td>${lawyer.barAssociationNumber || 'N/A'}</td>
                <td>${lawyer.contactNumber || 'N/A'}</td>
                <td>${lawyer.bio || 'N/A'}</td>
                <td>${lawyer.province || 'N/A'}</td>
                <td>${lawyer.district || 'N/A'}</td>
                <td>
                  <button class="btn btn-sm btn-outline-dark view-lawyer" data-lawyer='${JSON.stringify(lawyer)}'>
                    View
                  </button>
                  <button class="btn btn-sm btn-outline-dark delete-lawyer" data-email="${lawyer.email || ''}">
                    Delete
                  </button>
                </td>
              </tr>
            `;
            $('#lawyers-tbody').append(row);
          });

          $('#lawyers-count').text(lawyers.length);
          updateLawyerCharts();
        } else {
          $('#lawyers-tbody').html('<tr><td colspan="10" class="text-center">No lawyers found</td></tr>');
          updateLawyerCharts(); // Still update charts with fallback data
        }
      },
      error: function(xhr) {
        $('#lawyers-loading').hide();
        $('#lawyers-tbody').html('<tr><td colspan="10" class="text-center text-danger">Error loading data. Please try again.</td></tr>');
        console.error('Error loading lawyers:', xhr);
        updateLawyerCharts(); // Use fallback data on error
      }
    });
  }

  // Function to load clients
  function loadClients() {
    if (!token) {
      $('#clients-tbody').html('<tr><td colspan="9" class="text-center text-danger">Please log in to view data.</td></tr>');
      return;
    }

    $('#clients-loading').show();
    $('#clients-tbody').empty();

    $.ajax({
      url: 'http://localhost:8080/api/v1/dashboard/clients-byAdmin',
      type: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function(response) {
        $('#clients-loading').hide();
        if (response && response.code === 200 && response.data) {
          clients = response.data;
          clients.forEach(function(client) {
            const row = `
              <tr>
                <td>${client.full_name || 'N/A'}</td>
                <td>${client.email || 'N/A'}</td>
                <td>${client.phone_number || 'N/A'}</td>
                <td>${client.date_of_birth || 'N/A'}</td>
                <td>${client.address || 'N/A'}</td>
                <td>${client.preferred_language || 'N/A'}</td>
                <td>${client.gender || 'N/A'}</td>
                <td>${client.NIC || 'N/A'}</td>
                <td>
                  <button class="btn btn-sm btn-outline-dark view-client" data-client='${JSON.stringify(client)}'>
                    View
                  </button>
                  <button class="btn btn-sm btn-outline-dark delete-client" data-email="${client.email || ''}">
                    Delete
                  </button>
                </td>
              </tr>
            `;
            $('#clients-tbody').append(row);
          });

          $('#clients-count').text(clients.length);
          updateClientCharts();
        } else {
          $('#clients-tbody').html('<tr><td colspan="9" class="text-center">No clients found</td></tr>');
        }
      },
      error: function(xhr) {
        $('#clients-loading').hide();
        $('#clients-tbody').html('<tr><td colspan="9" class="text-center text-danger">Error loading data. Please try again.</td></tr>');
        console.error('Error loading clients:', xhr);
      }
    });
  }

  // Function to load all cases
  function loadAllCases() {
    if (!token) {
      $('#cases-tbody').html('<tr><td colspan="9" class="text-center text-danger">Please log in to view data.</td></tr>');
      return;
    }

    $('#cases-loading').show();
    $('#cases-tbody').empty();

    $.ajax({
      url: 'http://localhost:8080/api/v1/dashboard/cases-byAdmin',
      type: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function(response) {
        $('#cases-loading').hide();
        if (response && response.code === 200 && response.data) {
          cases = response.data;

          // Update counts for dashboard
          const activeCases = cases.filter(c => c.status === 'ACTIVE' || c.status === 'active').length;
          const completedCases = cases.filter(c => c.status === 'CLOSED' || c.status === 'closed').length;

          $('#active-cases-count').text(activeCases);
          $('#completedCases-count').text(completedCases);

          cases.forEach(function(caseItem) {
            const statusClass = getStatusClass(caseItem.status);
            const row = `
              <tr>
                <td>${caseItem.caseId || 'N/A'}</td>
                <td>${caseItem.caseNumber || 'N/A'}</td>
                <td>${caseItem.description ? caseItem.description.substr(0, 30) + '...' : 'N/A'}</td>
                <td><span class="status-indicator ${statusClass}">${caseItem.status || 'N/A'}</span></td>
                <td>${caseItem.clientName || 'N/A'}</td>
                <td>${caseItem.lawyerName || 'Not Assigned'}</td>
                <td>${caseItem.createdAt ? new Date(caseItem.createdAt).toLocaleString() : 'N/A'}</td>
                <td>${caseItem.updatedAt ? new Date(caseItem.updatedAt).toLocaleString() : 'N/A'}</td>
                <td>
                  <button class="btn btn-sm btn-outline-dark view-case" data-case='${JSON.stringify(caseItem)}'>
                    View
                  </button>
                </td>
              </tr>
            `;
            $('#cases-tbody').append(row);
          });

          updateCasesCharts();
        } else {
          $('#cases-tbody').html('<tr><td colspan="9" class="text-center">No cases found</td></tr>');
        }
      },
      error: function(xhr) {
        $('#cases-loading').hide();
        $('#cases-tbody').html('<tr><td colspan="9" class="text-center text-danger">Error loading data. Please try again.</td></tr>');
        console.error('Error loading cases:', xhr);
      }
    });
  }

  // Function to load appointments
  function loadAppointments() {
    if (!token) {
      $('#appointments-tbody').html('<tr><td colspan="7" class="text-center text-danger">Please log in to view data.</td></tr>');
      return;
    }

    $('#appointments-loading').show();
    $('#appointments-tbody').empty();

    $.ajax({
      url: 'http://localhost:8080/api/v1/appointment/all',
      type: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function(response) {
        $('#appointments-loading').hide();
        if (response && Array.isArray(response)) {
          appointments = response;
          renderAppointments(appointments);
        } else {
          $('#appointments-tbody').html('<tr><td colspan="7" class="text-center">No appointments found</td></tr>');
        }
      },
      error: function(xhr) {
        $('#appointments-loading').hide();
        $('#appointments-tbody').html('<tr><td colspan="7" class="text-center text-danger">Error loading data. Please try again.</td></tr>');
        console.error('Error loading appointments:', xhr);
      }
    });
  }

  // Function to render appointments table
  function renderAppointments(data) {
    $('#appointments-tbody').empty();
    if (data.length === 0) {
      $('#appointments-tbody').html('<tr><td colspan="7" class="text-center">No appointments found</td></tr>');
      return;
    }

    data.forEach(function(appointment, index) {
      const statusClass = getStatusClass(appointment.status);
      const row = `
        <tr>
          <td>${index + 1}</td>
          <td>${appointment.clientEmail || 'N/A'}</td>
          <td>${appointment.lawyerEmail || 'N/A'}</td>
          <td>${appointment.appointmentTime ? new Date(appointment.appointmentTime).toLocaleString() : 'N/A'}</td>
          <td><a href="${appointment.googleMeetLink || '#'}" target="_blank">${appointment.googleMeetLink ? 'Join Meeting' : 'N/A'}</a></td>
          <td><span class="status-indicator ${statusClass}">${appointment.status || 'N/A'}</span></td>
          <td>
            <button class="btn btn-sm btn-outline-dark edit-appointment" data-appointment='${JSON.stringify(appointment)}' data-id="${index + 1}">
              Edit
            </button>
          </td>
        </tr>
      `;
      $('#appointments-tbody').append(row);
    });
  }

  // Function to filter appointments
  function filterAppointments() {
    const searchQuery = $('#appointments-search').val().toLowerCase();
    const statusFilter = $('#appointments-status-filter').val();

    const filteredAppointments = appointments.filter(appointment => {
      const matchesSearch = appointment.clientEmail.toLowerCase().includes(searchQuery) ||
        appointment.lawyerEmail.toLowerCase().includes(searchQuery) ||
        (appointment.appointmentTime && new Date(appointment.appointmentTime).toLocaleString().toLowerCase().includes(searchQuery));
      const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    renderAppointments(filteredAppointments);
  }

  // Handle search input
  $('#appointments-search').on('input', filterAppointments);

  // Handle status filter change
  $('#appointments-status-filter').on('change', filterAppointments);

  // Handle edit appointment button click
  $(document).on('click', '.edit-appointment', function() {
    const appointment = JSON.parse($(this).attr('data-appointment'));
    const appointmentId = $(this).attr('data-id');

    // Populate modal fields
    $('#edit-appointment-id').val(appointmentId);
    $('#edit-client-email').val(appointment.clientEmail || '');
    $('#edit-lawyer-email').val(appointment.lawyerEmail || '');
    $('#edit-appointment-time').val(appointment.appointmentTime ? new Date(appointment.appointmentTime).toISOString().slice(0, 16) : '');
    $('#edit-google-meet-link').val(appointment.googleMeetLink || '');
    $('#edit-status').val(appointment.status || 'PENDING');
    $('#edit-appointment-result').text('');

    // Show modal
    $('#editAppointmentModal').modal('show');
  });

  // Handle save changes in edit modal
  $('#save-appointment-changes').click(function() {
    const appointmentId = $('#edit-appointment-id').val();
    const appointmentData = {
      clientEmail: $('#edit-client-email').val(),
      lawyerEmail: $('#edit-lawyer-email').val(),
      appointmentTime: $('#edit-appointment-time').val(),
      googleMeetLink: $('#edit-google-meet-link').val(),
      status: $('#edit-status').val()
    };

    if (!appointmentData.clientEmail || !appointmentData.lawyerEmail || !appointmentData.appointmentTime || !appointmentData.status) {
      $('#edit-appointment-result').removeClass('success').addClass('error').text('Please fill in all required fields.');
      return;
    }

    $.ajax({
      url: `http://localhost:8080/api/v1/appointment/${appointmentId}/manage?status=${encodeURIComponent(appointmentData.status)}`,
      type: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(appointmentData),
      success: function(response) {
        if (response) {
          $('#edit-appointment-result').removeClass('error').addClass('success').text('Appointment updated successfully.');
          setTimeout(() => {
            $('#editAppointmentModal').modal('hide');
            loadAppointments();
          }, 1000);
        } else {
          $('#edit-appointment-result').removeClass('success').addClass('error').text('Unexpected response from server.');
        }
      },
      error: function(xhr) {
        const errorMsg = xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : 'Error updating appointment.';
        $('#edit-appointment-result').removeClass('success').addClass('error').text(errorMsg);
        console.error('Error updating appointment:', xhr);
      }
    });
  });

  function getStatusClass(status) {
    if (!status) return '';
    status = status.toLowerCase();
    if (status === 'active' || status === 'confirmed') return 'status-confirmed';
    if (status === 'pending') return 'status-pending';
    if (status === 'closed' || status === 'rejected' || status === 'cancelled') return 'status-rejected';
    return '';
  }

  // Function to assign lawyer to case
  function assignLawyerToCase(caseNumber, lawyerId) {
    if (!token) {
      $('#assign-result').removeClass('success').addClass('error').text('Please log in to assign a lawyer.');
      return;
    }

    $.ajax({
      url: `http://localhost:8080/api/v1/case/assign/case-number/${encodeURIComponent(caseNumber)}?lawyerId=${lawyerId}`,
      type: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function(response) {
        if (response && response.code === 200) {
          $('#assign-result').removeClass('error').addClass('success').text(response.message);
          $('#assign-case-form')[0].reset(); // Reset form
          loadAllCases();
          updateCaseAssignmentCharts();
        } else {
          $('#assign-result').removeClass('success').addClass('error').text('Unexpected response from server.');
        }
      },
      error: function(xhr) {
        const errorMsg = xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : 'Error assigning lawyer. Please try again.';
        $('#assign-result').removeClass('success').addClass('error').text(errorMsg);
        console.error('Error assigning lawyer:', xhr);
      }
    });
  }

  // Function to delete lawyer account
  function deleteLawyerAccount(email) {
    if (!token) {
      alert('Please log in to delete accounts.');
      return;
    }

    $.ajax({
      url: 'http://localhost:8080/api/v1/user/delete-lawyer-account',
      type: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({ email: email }),
      success: function(response) {
        if (response && response.code === 200) {
          alert(response.message);
          loadLawyers(); // Refresh the table
        } else {
          alert('Unexpected response from server.');
        }
      },
      error: function(xhr) {
        const errorMsg = xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : 'Error deleting lawyer account.';
        alert(errorMsg);
        console.error('Error deleting lawyer:', xhr);
      }
    });
  }

  // Function to delete client account
  function deleteClientAccount(email) {
    if (!token) {
      alert('Please log in to delete accounts.');
      return;
    }

    $.ajax({
      url: 'http://localhost:8080/api/v1/user/delete-client-account',
      type: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({ email: email }),
      success: function(response) {
        if (response && response.code === 200) {
          alert(response.message);
          loadClients(); // Refresh the table
        } else {
          alert('Unexpected response from server.');
        }
      },
      error: function(xhr) {
        const errorMsg = xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : 'Error deleting client account.';
        alert(errorMsg);
        console.error('Error deleting client:', xhr);
      }
    });
  }

  // Handle form submission for assigning lawyer to case
  $('#assign-case-form').submit(function(e) {
    e.preventDefault();
    const caseNumber = $('#caseNumber').val();
    const lawyerId = $('#lawyerId').val();
    assignLawyerToCase(caseNumber, lawyerId);
  });

  // Handle "View" button clicks for lawyers
  $(document).on('click', '.view-lawyer', function() {
    const lawyer = JSON.parse($(this).attr('data-lawyer'));
    alert('Lawyer Details:\nName: ' + lawyer.lawyer_name + '\nSpecialization: ' + lawyer.specialization);
  });

  // Handle "Delete" button clicks for lawyers
  $(document).on('click', '.delete-lawyer', function() {
    const email = $(this).data('email');
    if (confirm('Are you sure you want to delete this lawyer account?')) {
      deleteLawyerAccount(email);
    }
  });

  // Handle "View" button clicks for clients
  $(document).on('click', '.view-client', function() {
    const client = JSON.parse($(this).attr('data-client'));
    alert('Client Details:\nName: ' + client.full_name + '\nEmail: ' + client.email);
  });

  // Handle "Delete" button clicks for clients
  $(document).on('click', '.delete-client', function() {
    const email = $(this).data('email');
    if (confirm('Are you sure you want to delete this client account?')) {
      deleteClientAccount(email);
    }
  });

  // Handle "View" button clicks for cases
  $(document).on('click', '.view-case', function() {
    const caseItem = JSON.parse($(this).attr('data-case'));
    alert('Case Details:\nCase Number: ' + caseItem.caseNumber + '\nDescription: ' + caseItem.description + '\nStatus: ' + caseItem.status);
  });

  // Update all dashboard statistics
  function updateDashboardStats() {
    loadLawyers();
    loadClients();
    loadAllCases();

    // Case Statistics Chart
    createCaseStatisticsChart();

    // Case Status Distribution Chart
    createCaseStatusChart();

    // Client Demographics Chart
    createClientDemographicsChart();
  }

  // Create Case Statistics Chart
  // Create Case Status Distribution Chart
  function createCaseStatusChart() {
    const ctx = document.getElementById('caseStatusChart')?.getContext('2d');
    if (!ctx) return;

    // Calculate case status distribution
    const statusCounts = cases.reduce((acc, c) => {
      const status = c.status?.toLowerCase() || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const data = {
      labels: ['Active', 'Pending', 'Closed', 'Unknown'],
      datasets: [{
        data: [
          statusCounts['active'] || 0,
          statusCounts['pending'] || 0,
          statusCounts['closed'] || 0,
          statusCounts['unknown'] || 0
        ],
        backgroundColor: ['#4361ee', '#ffb703', '#2e8b57', '#6c757d'],
        borderWidth: 0
      }]
    };

    const config = {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 10,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: '#fff',
            borderColor: '#4361ee',
            borderWidth: 1,
            bodyColor: '#333',
            titleColor: '#333'
          }
        },
        cutout: '60%'
      }
    };

    new Chart(ctx, config);
  }

  // Create Client Demographics Chart
  function createClientDemographicsChart() {
    const ctx = document.getElementById('clientDemographicsChart')?.getContext('2d');
    if (!ctx) return;

    // Calculate gender distribution
    const genderCounts = clients.reduce((acc, c) => {
      const gender = c.gender?.toLowerCase() || 'unknown';
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {});

    const data = {
      labels: ['Male', 'Female', 'Other', 'Unknown'],
      datasets: [{
        data: [
          genderCounts['male'] || 0,
          genderCounts['female'] || 0,
          genderCounts['other'] || 0,
          genderCounts['unknown'] || 0
        ],
        backgroundColor: ['#4361ee', '#e63946', '#ffb703', '#6c757d'],
        borderColor: '#fff',
        borderWidth: 2
      }]
    };

    const config = {
      type: 'pie',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 10,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: '#fff',
            borderColor: '#4361ee',
            borderWidth: 1,
            bodyColor: '#333',
            titleColor: '#333'
          }
        }
      }
    };

    new Chart(ctx, config);
  }

  // Update Lawyer Charts
  function updateLawyerCharts() {
    // Lawyer Specialization Chart
    const specializationCtx = document.getElementById('lawyerSpecializationChart')?.getContext('2d');
    if (specializationCtx) {
      const specializationCounts = lawyers.reduce((acc, l) => {
        const spec = l.specialization || 'Unknown';
        acc[spec] = (acc[spec] || 0) + 1;
        return acc;
      }, {});

      const specializationData = {
        labels: Object.keys(specializationCounts),
        datasets: [{
          data: Object.values(specializationCounts),
          backgroundColor: ['#4361ee', '#2e8b57', '#ffb703', '#e63946', '#4cc9f0', '#6c757d'],
          borderWidth: 0
        }]
      };

      new Chart(specializationCtx, {
        type: 'doughnut',
        data: specializationData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 10,
                usePointStyle: true,
                pointStyle: 'circle'
              }
            }
          },
          cutout: '60%'
        }
      });
    }

    // Lawyer Experience Chart
    const experienceCtx = document.getElementById('lawyerExperienceChart')?.getContext('2d');
    if (experienceCtx) {
      const experienceData = {
        labels: ['0-5 years', '6-10 years', '11-15 years', '16+ years'],
        datasets: [{
          label: 'Lawyers',
          data: [
            lawyers.filter(l => l.yearsOfExperience >= 0 && l.yearsOfExperience <= 5).length,
            lawyers.filter(l => l.yearsOfExperience > 5 && l.yearsOfExperience <= 10).length,
            lawyers.filter(l => l.yearsOfExperience > 10 && l.yearsOfExperience <= 15).length,
            lawyers.filter(l => l.yearsOfExperience > 15).length
          ],
          backgroundColor: '#4361ee',
          borderColor: '#4361ee',
          borderWidth: 1
        }]
      };

      new Chart(experienceCtx, {
        type: 'bar',
        data: experienceData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      });
    }

    // Lawyer Type Chart (Placeholder)
    const typeCtx = document.getElementById('lawyerTypeChart')?.getContext('2d');
    if (typeCtx) {
      const typeData = {
        labels: ['Full-time', 'Part-time', 'Contract'],
        datasets: [{
          data: [lawyers.length * 0.6, lawyers.length * 0.3, lawyers.length * 0.1],
          backgroundColor: ['#4361ee', '#2e8b57', '#ffb703'],
          borderWidth: 0
        }]
      };

      new Chart(typeCtx, {
        type: 'doughnut',
        data: typeData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 10,
                usePointStyle: true,
                pointStyle: 'circle'
              }
            }
          },
          cutout: '60%'
        }
      });
    }
  }

  // Update Client Charts
  function updateClientCharts() {
    // Client Gender Chart
    const genderCtx = document.getElementById('clientGenderChart')?.getContext('2d');
    if (genderCtx) {
      const genderCounts = clients.reduce((acc, c) => {
        const gender = c.gender?.toLowerCase() || 'unknown';
        acc[gender] = (acc[gender] || 0) + 1;
        return acc;
      }, {});

      const genderData = {
        labels: ['Male', 'Female', 'Other', 'Unknown'],
        datasets: [{
          data: [
            genderCounts['male'] || 0,
            genderCounts['female'] || 0,
            genderCounts['other'] || 0,
            genderCounts['unknown'] || 0
          ],
          backgroundColor: ['#4361ee', '#e63946', '#ffb703', '#6c757d'],
          borderWidth: 0
        }]
      };

      new Chart(genderCtx, {
        type: 'doughnut',
        data: genderData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 10,
                usePointStyle: true,
                pointStyle: 'circle'
              }
            }
          },
          cutout: '60%'
        }
      });
    }

    // Client Age Chart
    const ageCtx = document.getElementById('clientAgeChart')?.getContext('2d');
    if (ageCtx) {
      const ageData = {
        labels: ['18-30', '31-45', '46-60', '61+'],
        datasets: [{
          label: 'Clients',
          data: [
            clients.filter(c => {
              const age = c.date_of_birth ? (new Date().getFullYear() - new Date(c.date_of_birth).getFullYear()) : null;
              return age >= 18 && age <= 30;
            }).length,
            clients.filter(c => {
              const age = c.date_of_birth ? (new Date().getFullYear() - new Date(c.date_of_birth).getFullYear()) : null;
              return age > 30 && age <= 45;
            }).length,
            clients.filter(c => {
              const age = c.date_of_birth ? (new Date().getFullYear() - new Date(c.date_of_birth).getFullYear()) : null;
              return age > 45 && age <= 60;
            }).length,
            clients.filter(c => {
              const age = c.date_of_birth ? (new Date().getFullYear() - new Date(c.date_of_birth).getFullYear()) : null;
              return age > 60;
            }).length
          ],
          backgroundColor: '#4361ee',
          borderColor: '#4361ee',
          borderWidth: 1
        }]
      };

      new Chart(ageCtx, {
        type: 'bar',
        data: ageData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      });
    }

    // Client Language Chart
    const languageCtx = document.getElementById('clientLanguageChart')?.getContext('2d');
    if (languageCtx) {
      const languageCounts = clients.reduce((acc, c) => {
        const lang = c.preferred_language || 'Unknown';
        acc[lang] = (acc[lang] || 0) + 1;
        return acc;
      }, {});

      const languageData = {
        labels: Object.keys(languageCounts),
        datasets: [{
          data: Object.values(languageCounts),
          backgroundColor: ['#4361ee', '#2e8b57', '#ffb703', '#e63946', '#4cc9f0'],
          borderWidth: 0
        }]
      };

      new Chart(languageCtx, {
        type: 'doughnut',
        data: languageData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 10,
                usePointStyle: true,
                pointStyle: 'circle'
              }
            }
          },
          cutout: '60%'
        }
      });
    }
  }

  // Update Case Assignment Charts
  function updateCaseAssignmentCharts() {
    // Lawyer Case Load Chart
    const caseLoadCtx = document.getElementById('lawyerCaseLoadChart')?.getContext('2d');
    if (caseLoadCtx) {
      const lawyerCaseCounts = lawyers.map(l => ({
        name: l.lawyer_name,
        count: cases.filter(c => c.lawyerName === l.lawyer_name).length
      }));

      const caseLoadData = {
        labels: lawyerCaseCounts.map(l => l.name).slice(0, 5), // Limit to top 5 for display
        datasets: [{
          label: 'Cases Assigned',
          data: lawyerCaseCounts.map(l => l.count).slice(0, 5),
          backgroundColor: '#4361ee',
          borderColor: '#4361ee',
          borderWidth: 1
        }]
      };

      new Chart(caseLoadCtx, {
        type: 'bar',
        data: caseLoadData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      });
    }

    // Cases Timeline Chart
    const timelineCtx = document.getElementById('casesTimelineChart')?.getContext('2d');
    if (timelineCtx) {
      const timelineData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Cases Assigned',
          data: [5, 8, 6, 10, 12, 15, 14, 13, 16, 15, 18, 20],
          borderColor: '#4361ee',
          backgroundColor: 'rgba(67, 97, 238, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
      };

      new Chart(timelineCtx, {
        type: 'line',
        data: timelineData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                boxWidth: 10,
                usePointStyle: true,
                pointStyle: 'circle'
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 5
              }
            }
          }
        }
      });
    }
  }

  // Update Cases Charts
  function updateCasesCharts() {
    // Cases Status Distribution Chart
    const statusDistCtx = document.getElementById('casesStatusDistributionChart')?.getContext('2d');
    if (statusDistCtx) {
      const statusCounts = cases.reduce((acc, c) => {
        const status = c.status?.toLowerCase() || 'unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      const statusData = {
        labels: ['Active', 'Pending', 'Closed', 'Unknown'],
        datasets: [{
          data: [
            statusCounts['active'] || 0,
            statusCounts['pending'] || 0,
            statusCounts['closed'] || 0,
            statusCounts['unknown'] || 0
          ],
          backgroundColor: ['#4361ee', '#ffb703', '#2e8b57', '#6c757d'],
          borderWidth: 0
        }]
      };

      new Chart(statusDistCtx, {
        type: 'doughnut',
        data: statusData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 10,
                usePointStyle: true,
                pointStyle: 'circle'
              }
            }
          },
          cutout: '60%'
        }
      });
    }

    // Monthly Case Trend Chart
    const trendCtx = document.getElementById('casesTrendChart')?.getContext('2d');
    if (trendCtx) {
      const monthlyCounts = Array(12).fill(0);
      cases.forEach(c => {
        if (c.createdAt) {
          const month = new Date(c.createdAt).getMonth();
          monthlyCounts[month]++;
        }
      });

      const trendData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'New Cases',
          data: monthlyCounts,
          borderColor: '#4361ee',
          backgroundColor: 'rgba(67, 97, 238, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
      };

      new Chart(trendCtx, {
        type: 'line',
        data: trendData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                boxWidth: 10,
                usePointStyle: true,
                pointStyle: 'circle'
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 5
              }
            }
          }
        }
      });
    }
  }

  // Initial load
  activateSection('dashboard');
  updateDashboardStats();
});
