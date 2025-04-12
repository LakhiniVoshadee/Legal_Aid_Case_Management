$(document).ready(function() {
  const token = localStorage.getItem('token'); // Replace with your JWT token retrieval method
  let lawyers = [];
  let clients = [];
  let cases = [];

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
    updateLawyerCharts();
  });

  $('#clients-nav-link').click(function(e) {
    e.preventDefault();
    activateSection('clients');
    loadClients();
    updateClientCharts();
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
    updateCasesCharts();
  });

  function activateSection(section) {
    $('.content-section').removeClass('active');
    $(`#${section}-content`).addClass('active');

    // Update sidebar active state
    $('#sidebar ul li').removeClass('active');
    $(`#sidebar ul li a[href="#${section}"]`).parent().addClass('active');
  }

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
                </td>
              </tr>
            `;
            $('#lawyers-tbody').append(row);
          });

          $('#lawyers-count').text(lawyers.length);
          updateLawyerCharts();
        } else {
          $('#lawyers-tbody').html('<tr><td colspan="10" class="text-center">No lawyers found</td></tr>');
        }
      },
      error: function(xhr) {
        $('#lawyers-loading').hide();
        $('#lawyers-tbody').html('<tr><td colspan="10" class="text-center text-danger">Error loading data. Please try again.</td></tr>');
        console.error('Error loading lawyers:', xhr);
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
          $('#completed-cases-count').text(completedCases);

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

  function getStatusClass(status) {
    if (!status) return '';
    status = status.toLowerCase();
    if (status === 'active') return 'status-active';
    if (status === 'pending') return 'status-pending';
    if (status === 'closed') return 'status-closed';
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

          // Refresh case data
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

  // Handle "View" button clicks for clients
  $(document).on('click', '.view-client', function() {
    const client = JSON.parse($(this).attr('data-client'));
    alert('Client Details:\nName: ' + client.full_name + '\nEmail: ' + client.email);
  });

  // Handle "View" button clicks for cases
  $(document).on('click', '.view-case', function() {
    const caseItem = JSON.parse($(this).attr('data-case'));
    alert('Case Details:\nCase Number: ' + caseItem.caseNumber + '\nDescription: ' + caseItem.description + '\nStatus: ' + caseItem.status);
  });

  // Handle form submission for assigning lawyer to case
  $('#assign-case-form').submit(function(e) {
    e.preventDefault();
    const caseId = $('#caseId').val();
    const lawyerId = $('#lawyerId').val();
    assignLawyerToCase(caseId, lawyerId);
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

    // Lawyer Specialization Chart
    createLawyerSpecializationChart();

    // Client Demographics Chart
    createClientDemographicsChart();
  }

  // Create Case Statistics Chart
  function createCaseStatisticsChart() {
    const ctx = document.getElementById('caseStatisticsChart').getContext('2d');

    const data = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'New Cases',
          data: [12, 19, 15, 17, 20, 25, 22, 18, 26, 23, 25, 31],
          borderColor: '#4361ee',
          backgroundColor: 'rgba(67, 97, 238, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        },
        {
          label: 'Resolved Cases',
          data: [8, 12, 10, 14, 16, 19, 18, 20, 22, 20, 22, 25],
          borderColor: '#2e8b57',
          backgroundColor: 'rgba(46, 139, 87, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }
      ]
    };

    const config = {
      type: 'line',
      data: data,
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
          },
          tooltip: {
            mode: 'index',
            intersect: false
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
            grid: {
              borderDash: [2, 2]
            }
          }
        }
      }
    };

    if (window.caseStatisticsChart) {
      window.caseStatisticsChart.destroy();
    }

    window.caseStatisticsChart = new Chart(ctx, config);

    // Live update simulation
    setInterval(function() {
      const datasets = window.caseStatisticsChart.data.datasets;
      for (let i = 0; i < datasets.length; i++) {
        datasets[i].data = datasets[i].data.map(value => value + Math.floor(Math.random() * 3) - 1);
      }
      window.caseStatisticsChart.update();
    }, 5000);
  }

  // Create Case Status Chart
  function createCaseStatusChart() {
    const ctx = document.getElementById('caseStatusChart').getContext('2d');

    const data = {
      labels: ['Active', 'Pending', 'Closed', 'On Hold'],
      datasets: [{
        data: [35, 25, 30, 10],
        backgroundColor: ['#4361ee', '#ffb703', '#6c757d', '#e63946'],
        borderWidth: 1
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
          }
        },
        cutout: '70%'
      }
    };

    if (window.caseStatusChart) {
      window.caseStatusChart.destroy();
    }

    window.caseStatusChart = new Chart(ctx, config);

    // Live update simulation
    setInterval(function() {
      const data = window.caseStatusChart.data.datasets[0].data;
      for (let i = 0; i < data.length; i++) {
        data[i] = Math.max(5, data[i] + Math.floor(Math.random() * 5) - 2);
      }
      window.caseStatusChart.update();
    }, 7000);
  }

  // Create Lawyer Specialization Chart
  function createLawyerSpecializationChart() {
    const ctx = document.getElementById('lawyerSpecializationChart').getContext('2d');

    const data = {
      labels: ['Criminal', 'Civil', 'Corporate', 'Family', 'Real Estate', 'Immigration'],
      datasets: [{
        label: 'Number of Lawyers',
        data: [15, 20, 12, 8, 10, 5],
        backgroundColor: [
          'rgba(67, 97, 238, 0.7)',
          'rgba(46, 139, 87, 0.7)',
          'rgba(255, 183, 3, 0.7)',
          'rgba(76, 201, 240, 0.7)',
          'rgba(108, 117, 125, 0.7)',
          'rgba(230, 57, 70, 0.7)'
        ],
        borderWidth: 1
      }]
    };

    const config = {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
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
            grid: {
              borderDash: [2, 2]
            }
          }
        }
      }
    };

    if (window.lawyerSpecializationChart) {
      window.lawyerSpecializationChart.destroy();
    }

    window.lawyerSpecializationChart = new Chart(ctx, config);

    // Live update simulation
    setInterval(function() {
      const data = window.lawyerSpecializationChart.data.datasets[0].data;
      for (let i = 0; i < data.length; i++) {
        data[i] = Math.max(1, data[i] + Math.floor(Math.random() * 3) - 1);
      }
      window.lawyerSpecializationChart.update();
    }, 8000);
  }

  // Create Client Demographics Chart
  function createClientDemographicsChart() {
    const ctx = document.getElementById('clientDemographicsChart').getContext('2d');

    const data = {
      labels: ['18-25', '26-35', '36-45', '46-55', '56-65', '65+'],
      datasets: [{
        label: 'Client Age Distribution',
        data: [10, 25, 30, 20, 10, 5],
        backgroundColor: 'rgba(76, 201, 240, 0.5)',
        borderColor: '#4cc9f0',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }]
    };

    const config = {
      type: 'radar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          line: {
            borderWidth: 2
          }
        },
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          r: {
            angleLines: {
              display: true
            },
            ticks: {
              backdropColor: 'transparent',
              display: false
            }
          }
        }
      }
    };

    if (window.clientDemographicsChart) {
      window.clientDemographicsChart.destroy();
    }

    window.clientDemographicsChart = new Chart(ctx, config);

    // Live update simulation
    setInterval(function() {
      const data = window.clientDemographicsChart.data.datasets[0].data;
      for (let i = 0; i < data.length; i++) {
        data[i] = Math.max(1, data[i] + Math.floor(Math.random() * 3) - 1);
      }
      window.clientDemographicsChart.update();
    }, 6000);
  }

  // Update lawyer specific charts
  function updateLawyerCharts() {
    // Create Lawyer Experience Chart
    createLawyerExperienceChart();

    // Create Lawyer Location Chart
    createLawyerLocationChart();

    // Create Lawyer Type Chart
    createLawyerTypeChart();
  }

  // Create Lawyer Experience Chart
  function createLawyerExperienceChart() {
    const ctx = document.getElementById('lawyerExperienceChart').getContext('2d');

    const data = {
      labels: ['0-2 years', '3-5 years', '6-10 years', '11-20 years', '20+ years'],
      datasets: [{
        data: [10, 15, 20, 15, 5],
        backgroundColor: [
          'rgba(67, 97, 238, 0.7)',
          'rgba(76, 201, 240, 0.7)',
          'rgba(46, 139, 87, 0.7)',
          'rgba(255, 183, 3, 0.7)',
          'rgba(230, 57, 70, 0.7)'
        ],
        borderWidth: 1
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
            position: 'right',
            labels: {
              boxWidth: 10,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          }
        }
      }
    };

    if (window.lawyerExperienceChart) {
      window.lawyerExperienceChart.destroy();
    }

    window.lawyerExperienceChart = new Chart(ctx, config);

    // Live update simulation
    setInterval(function() {
      const data = window.lawyerExperienceChart.data.datasets[0].data;
      for (let i = 0; i < data.length; i++) {
        data[i] = Math.max(1, data[i] + Math.floor(Math.random() * 3) - 1);
      }
      window.lawyerExperienceChart.update();
    }, 9000);
  }

  // Create Lawyer Location Chart
  function createLawyerLocationChart() {
    const ctx = document.getElementById('lawyerLocationChart').getContext('2d');

    const data = {
      labels: ['Central', 'Northern', 'Southern', 'Eastern', 'Western'],
      datasets: [{
        label: 'Lawyers by Location',
        data: [18, 12, 15, 10, 20],
        backgroundColor: 'rgba(76, 201, 240, 0.5)',
        borderColor: '#4cc9f0',
        borderWidth: 2
      }]
    };

    const config = {
      type: 'polarArea',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 10,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          }
        }
      }
    };

    if (window.lawyerLocationChart) {
      window.lawyerLocationChart.destroy();
    }

    window.lawyerLocationChart = new Chart(ctx, config);

    // Live update simulation
    setInterval(function() {
      const data = window.lawyerLocationChart.data.datasets[0].data;
      for (let i = 0; i < data.length; i++) {
        data[i] = Math.max(1, data[i] + Math.floor(Math.random() * 3) - 1);
      }
      window.lawyerLocationChart.update();
    }, 7500);
  }

  // Create Lawyer Type Chart
  function createLawyerTypeChart() {
    const ctx = document.getElementById('lawyerTypeChart').getContext('2d');

    const data = {
      labels: ['Criminal', 'Civil', 'Corporate', 'Family', 'Real Estate', 'Immigration'],
      datasets: [{
        label: 'Number of Lawyers',
        data: [15, 20, 12, 8, 10, 5],
        backgroundColor: 'rgba(46, 139, 87, 0.5)',
        borderColor: '#2e8b57',
        borderWidth: 2
      }]
    };

    const config = {
      type: 'radar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          line: {
            borderWidth: 2
          }
        },
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          r: {
            angleLines: {
              display: true
            },
            ticks: {
              backdropColor: 'transparent',
              display: false
            }
          }
        }
      }
    };

    if (window.lawyerTypeChart) {
      window.lawyerTypeChart.destroy();
    }

    window.lawyerTypeChart = new Chart(ctx, config);

    // Live update simulation
    setInterval(function() {
      const data = window.lawyerTypeChart.data.datasets[0].data;
      for (let i = 0; i < data.length; i++) {
        data[i] = Math.max(1, data[i] + Math.floor(Math.random() * 3) - 1);
      }
      window.lawyerTypeChart.update();
    }, 8000);
  }

  // Update client specific charts
  function updateClientCharts() {
    // Create Client Gender Chart
    createClientGenderChart();

    // Create Client Language Chart
    createClientLanguageChart();

    // Create Client Registration Chart
    createClientRegistrationChart();
  }

  // Create Client Gender Chart
  function createClientGenderChart() {
    const ctx = document.getElementById('clientGenderChart').getContext('2d');

    const data = {
      labels: ['Male', 'Female', 'Other'],
      datasets: [{
        data: [45, 52, 3],
        backgroundColor: [
          'rgba(67, 97, 238, 0.7)',
          'rgba(230, 57, 70, 0.7)',
          'rgba(255, 183, 3, 0.7)'
        ],
        borderWidth: 1
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
            position: 'right',
            labels: {
              boxWidth: 10,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          }
        },
        cutout: '70%'
      }
    };

    if (window.clientGenderChart) {
      window.clientGenderChart.destroy();
    }

    window.clientGenderChart = new Chart(ctx, config);

    // Live update simulation
    setInterval(function() {
      const data = window.clientGenderChart.data.datasets[0].data;
      for (let i = 0; i < data.length; i++) {
        data[i] = Math.max(1, data[i] + Math.floor(Math.random() * 5) - 2);
      }
      window.clientGenderChart.update();
    }, 6500);
  }

  // Create Client Language Chart
  function createClientLanguageChart() {
    const ctx = document.getElementById('clientLanguageChart').getContext('2d');

    const data = {
      labels: ['English', 'French', 'Spanish', 'Mandarin', 'Arabic', 'Other'],
      datasets: [{
        label: 'Preferred Language',
        data: [40, 10, 15, 8, 12, 15],
        backgroundColor: [
          'rgba(67, 97, 238, 0.7)',
          'rgba(230, 57, 70, 0.7)',
          'rgba(46, 139, 87, 0.7)',
          'rgba(76, 201, 240, 0.7)',
          'rgba(255, 183, 3, 0.7)',
          'rgba(108, 117, 125, 0.7)'
        ],
        borderWidth: 1
      }]
    };

    const config = {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            grid: {
              display: false
            }
          }
        }
      }
    };

    if (window.clientLanguageChart) {
      window.clientLanguageChart.destroy();
    }

    window.clientLanguageChart = new Chart(ctx, config);

    // Live update simulation
    setInterval(function() {
      const data = window.clientLanguageChart.data.datasets[0].data;
      for (let i = 0; i < data.length; i++) {
        data[i] = Math.max(1, data[i] + Math.floor(Math.random() * 3) - 1);
      }
      window.clientLanguageChart.update();
    }, 7200);
  }

  // Create Client Registration Chart
  function createClientRegistrationChart() {
    const ctx = document.getElementById('clientRegistrationChart').getContext('2d');

    const data = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'New Clients',
        data: [8, 12, 15, 10, 18, 20, 16, 14, 22, 19, 21, 25],
        backgroundColor: 'rgba(230, 57, 70, 0.5)',
        borderColor: '#e63946',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }]
    };

    const config = {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
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
            grid: {
              borderDash: [2, 2]
            }
          }
        }
      }
    };

    if (window.clientRegistrationChart) {
      window.clientRegistrationChart.destroy();
    }

    window.clientRegistrationChart = new Chart(ctx, config);

    // Live update simulation
    setInterval(function() {
      const data = window.clientRegistrationChart.data.datasets[0].data;
      for (let i = 0; i < data.length; i++) {
        data[i] = Math.max(1, data[i] + Math.floor(Math.random() * 3) - 1);
      }
      window.clientRegistrationChart.update();
    }, 6800);
  }

  // Update case assignment charts
  function updateCaseAssignmentCharts() {
    loadAllCases();

    // Populate case and lawyer dropdowns
    populateCaseDropdown();
    populateLawyerDropdown();

    // Create Case Assignment Distribution Chart
    createCaseAssignmentDistributionChart();

    // Create Case Assignment Timeline Chart
    createCaseAssignmentTimelineChart();
  }

  // Populate case dropdown
  function populateCaseDropdown() {
    if (!token) {
      $('#caseId').html('<option value="">Login required</option>');
      return;
    }

    $.ajax({
      url: 'http://localhost:8080/api/v1/dashboard/unassigned-cases',
      type: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function(response) {
        $('#caseId').empty();
        $('#caseId').append('<option value="">Select a case</option>');

        if (response && response.code === 200 && response.data) {
          const unassignedCases = response.data;
          unassignedCases.forEach(function(caseItem) {
            $('#caseId').append(`<option value="${caseItem.caseId}">${caseItem.caseNumber} - ${caseItem.description.substr(0, 30)}...</option>`);
          });
        } else {
          $('#caseId').append('<option value="">No unassigned cases</option>');
        }
      },
      error: function(xhr) {
        $('#caseId').html('<option value="">Error loading cases</option>');
        console.error('Error loading unassigned cases:', xhr);
      }
    });
  }

  // Populate lawyer dropdown
  function populateLawyerDropdown() {
    if (!token) {
      $('#lawyerId').html('<option value="">Login required</option>');
      return;
    }

    if (lawyers.length > 0) {
      $('#lawyerId').empty();
      $('#lawyerId').append('<option value="">Select a lawyer</option>');

      lawyers.forEach(function(lawyer) {
        $('#lawyerId').append(`<option value="${lawyer.lawyerId}">${lawyer.lawyer_name} - ${lawyer.specialization}</option>`);
      });
    } else {
      $.ajax({
        url: 'http://localhost:8080/api/v1/dashboard/lawyers-byAdmin',
        type: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token
        },
        success: function(response) {
          $('#lawyerId').empty();
          $('#lawyerId').append('<option value="">Select a lawyer</option>');

          if (response && response.code === 200 && response.data) {
            lawyers = response.data;
            lawyers.forEach(function(lawyer) {
              $('#lawyerId').append(`<option value="${lawyer.lawyerId}">${lawyer.lawyer_name} - ${lawyer.specialization}</option>`);
            });
          } else {
            $('#lawyerId').append('<option value="">No lawyers available</option>');
          }
        },
        error: function(xhr) {
          $('#lawyerId').html('<option value="">Error loading lawyers</option>');
          console.error('Error loading lawyers:', xhr);
        }
      });
    }
  }

  // Create Case Assignment Distribution Chart
  function createCaseAssignmentDistributionChart() {
    const ctx = document.getElementById('caseAssignmentDistributionChart').getContext('2d');

    const data = {
      labels: ['Assigned', 'Unassigned'],
      datasets: [{
        data: [65, 35],
        backgroundColor: [
          'rgba(46, 139, 87, 0.7)',
          'rgba(230, 57, 70, 0.7)'
        ],
        borderWidth: 1
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
          }
        }
      }
    };

    if (window.caseAssignmentDistributionChart) {
      window.caseAssignmentDistributionChart.destroy();
    }

    window.caseAssignmentDistributionChart = new Chart(ctx, config);

    // Live update simulation
    setInterval(function() {
      const data = window.caseAssignmentDistributionChart.data.datasets[0].data;
      for (let i = 0; i < data.length; i++) {
        data[i] = Math.max(10, data[i] + Math.floor(Math.random() * 5) - 2);
      }
      window.caseAssignmentDistributionChart.update();
    }, 5500);
  }

  // Create Case Assignment Timeline Chart
  function createCaseAssignmentTimelineChart() {
    const ctx = document.getElementById('caseAssignmentTimelineChart').getContext('2d');

    const data = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'New Cases',
          data: [10, 15, 12, 18, 20, 22, 16, 14, 25, 20, 22, 28],
          backgroundColor: 'rgba(67, 97, 238, 0.5)',
          borderColor: '#4361ee',
          borderWidth: 2,
          barPercentage: 0.6
        },
        {
          label: 'Assigned Cases',
          data: [8, 12, 10, 14, 16, 19, 14, 12, 20, 18, 20, 24],
          backgroundColor: 'rgba(46, 139, 87, 0.5)',
          borderColor: '#2e8b57',
          borderWidth: 2,
          barPercentage: 0.6
        }
      ]
    };

    const config = {
      type: 'bar',
      data: data,
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
            grid: {
              borderDash: [2, 2]
            }
          }
        }
      }
    };

    if (window.caseAssignmentTimelineChart) {
      window.caseAssignmentTimelineChart.destroy();
    }

    window.caseAssignmentTimelineChart = new Chart(ctx, config);

    // Live update simulation
    setInterval(function() {
      const datasets = window.caseAssignmentTimelineChart.data.datasets;
      for (let i = 0; i < datasets.length; i++) {
        for (let j = 0; j < datasets[i].data.length; j++) {
          datasets[i].data[j] = Math.max(1, datasets[i].data[j] + Math.floor(Math.random() * 3) - 1);
        }
      }
      window.caseAssignmentTimelineChart.update();
    }, 6000);
  }

  // Update cases charts
  function updateCasesCharts() {
    // Create Case Type Chart
    createCaseTypeChart();

    // Create Case Duration Chart
    createCaseDurationChart();

    // Create Case Resolution Rate Chart
    createCaseResolutionRateChart();
  }

  // Create Case Type Chart
  function createCaseTypeChart() {
    const ctx = document.getElementById('caseTypeChart').getContext('2d');

    const data = {
      labels: ['Criminal', 'Civil', 'Corporate', 'Family', 'Real Estate', 'Immigration'],
      datasets: [{
        label: 'Number of Cases',
        data: [25, 35, 18, 22, 15, 10],
        backgroundColor: [
          'rgba(67, 97, 238, 0.7)',
          'rgba(46, 139, 87, 0.7)',
          'rgba(255, 183, 3, 0.7)',
          'rgba(76, 201, 240, 0.7)',
          'rgba(108, 117, 125, 0.7)',
          'rgba(230, 57, 70, 0.7)'
        ],
        borderWidth: 1
      }]
    };

    const config = {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
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
            grid: {
              borderDash: [2, 2]
            }
          }
        }
      }
    };

    if (window.caseTypeChart) {
      window.caseTypeChart.destroy();
    }

    window.caseTypeChart = new Chart(ctx, config);

    // Live update simulation
    setInterval(function() {
      const data = window.caseTypeChart.data.datasets[0].data;
      for (let i = 0; i < data.length; i++) {
        data[i] = Math.max(1, data[i] + Math.floor(Math.random() * 3) - 1);
      }
      window.caseTypeChart.update();
    }, 7300);
  }

  // Initialize on page load
  $(document).ready(function() {
    activateSection('dashboard');
    updateDashboardStats();
  });
});
