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
  function createCaseStatisticsChart() {
    const ctx = document.getElementById('caseStatisticsChart')?.getContext('2d');
    if (!ctx) return;

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

    if (window.caseStatisticsChart && typeof window.caseStatisticsChart.destroy === 'function') {
      window.caseStatisticsChart.destroy();
    }

    window.caseStatisticsChart = new Chart(ctx, config);

    // Live update simulation
    setInterval(function() {
      if (window.caseStatisticsChart) {
        const datasets = window.caseStatisticsChart.data.datasets;
        for (let i = 0; i < datasets.length; i++) {
          datasets[i].data = datasets[i].data.map(value => value + Math.floor(Math.random() * 3) - 1);
        }
        window.caseStatisticsChart.update();
      }
    }, 5000);
  }

  // Create Case Status Chart
  function createCaseStatusChart() {
    const ctx = document.getElementById('caseStatusChart')?.getContext('2d');
    if (!ctx) return;

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

    if (window.caseStatusChart && typeof window.caseStatusChart.destroy === 'function') {
      window.caseStatusChart.destroy();
    }

    window.caseStatusChart = new Chart(ctx, config);

    // Live update simulation
    setInterval(function() {
      if (window.caseStatusChart) {
        const data = window.caseStatusChart.data.datasets[0].data;
        for (let i = 0; i < data.length; i++) {
          data[i] = Math.max(5, data[i] + Math.floor(Math.random() * 5) - 2);
        }
        window.caseStatusChart.update();
      }
    }, 7000);
  }

  // Create Client Demographics Chart
  function createClientDemographicsChart() {
    const ctx = document.getElementById('clientDemographicsChart')?.getContext('2d');
    if (!ctx) return;

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

    if (window.clientDemographicsChart && typeof window.clientDemographicsChart.destroy === 'function') {
      window.clientDemographicsChart.destroy();
    }

    window.clientDemographicsChart = new Chart(ctx, config);

    // Live update simulation
    setInterval(function() {
      if (window.clientDemographicsChart) {
        const data = window.clientDemographicsChart.data.datasets[0].data;
        for (let i = 0; i < data.length; i++) {
          data[i] = Math.max(1, data[i] + Math.floor(Math.random() * 3) - 1);
        }
        window.clientDemographicsChart.update();
      }
    }, 6000);
  }

  // Update lawyer specific charts
  function updateLawyerCharts() {
    createLawyerExperienceChart();
    createLawyerSpecializationChart();
    createLawyerTypeChart();
  }

  // Create Lawyer Experience Chart
  function createLawyerExperienceChart() {
    const ctx = document.getElementById('lawyerExperienceChart')?.getContext('2d');
    if (!ctx) return;

    // Aggregate experience data from lawyers array
    const experienceBins = {
      '0-2 years': 0,
      '3-5 years': 0,
      '6-10 years': 0,
      '11-20 years': 0,
      '20+ years': 0
    };

    lawyers.forEach(lawyer => {
      const years = parseInt(lawyer.yearsOfExperience, 10) || 0;
      if (years <= 2) {
        experienceBins['0-2 years']++;
      } else if (years <= 5) {
        experienceBins['3-5 years']++;
      } else if (years <= 10) {
        experienceBins['6-10 years']++;
      } else if (years <= 20) {
        experienceBins['11-20 years']++;
      } else {
        experienceBins['20+ years']++;
      }
    });

    const labels = Object.keys(experienceBins);
    const dataValues = Object.values(experienceBins);

    const data = {
      labels: labels.length > 0 ? labels : ['0-2 years', '3-5 years', '6-10 years', '11-20 years', '20+ years'],
      datasets: [{
        data: dataValues.length > 0 ? dataValues : [10, 15, 20, 15, 5],
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

    if (window.lawyerExperienceChart && typeof window.lawyerExperienceChart.destroy === 'function') {
      window.lawyerExperienceChart.destroy();
    }

    window.lawyerExperienceChart = new Chart(ctx, config);
  }

  // Create Lawyer Specialization Chart
  function createLawyerSpecializationChart() {
    const ctx = document.getElementById('lawyerSpecializationChart')?.getContext('2d');
    if (!ctx) return;

    // Aggregate specialization data from lawyers array
    const specializationCount = {};
    lawyers.forEach(lawyer => {
      const spec = lawyer.specialization || 'Unknown';
      specializationCount[spec] = (specializationCount[spec] || 0) + 1;
    });

    const labels = Object.keys(specializationCount);
    const dataValues = Object.values(specializationCount);

    const data = {
      labels: labels.length > 0 ? labels : ['Criminal', 'Civil', 'Corporate', 'Family', 'Real Estate', 'Immigration'],
      datasets: [{
        label: 'Number of Lawyers',
        data: dataValues.length > 0 ? dataValues : [15, 20, 12, 8, 10, 5],
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

    if (window.lawyerSpecializationChart && typeof window.lawyerSpecializationChart.destroy === 'function') {
      window.lawyerSpecializationChart.destroy();
    }

    window.lawyerSpecializationChart = new Chart(ctx, config);
  }

  // Create Lawyer Type Chart
  function createLawyerTypeChart() {
    const ctx = document.getElementById('lawyerTypeChart')?.getContext('2d');
    if (!ctx) return;

    // Aggregate type data from lawyers array (assuming type is derived from specialization)
    const typeCount = {};
    lawyers.forEach(lawyer => {
      const type = lawyer.specialization || 'Unknown'; // Use specialization as type; adjust if there's a specific 'type' field
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    const labels = Object.keys(typeCount);
    const dataValues = Object.values(typeCount);

    const data = {
      labels: labels.length > 0 ? labels : ['Criminal', 'Civil', 'Corporate', 'Family', 'Real Estate', 'Immigration'],
      datasets: [{
        label: 'Number of Lawyers',
        data: dataValues.length > 0 ? dataValues : [15, 20, 12, 8, 10, 5],
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

    if (window.lawyerTypeChart && typeof window.lawyerTypeChart.destroy === 'function') {
      window.lawyerTypeChart.destroy();
    }

    window.lawyerTypeChart = new Chart(ctx, config);
  }

  // Update client specific charts
  function updateClientCharts() {
    createClientGenderChart();
    createClientLanguageChart();
    createClientRegistrationChart();
  }

  // Create Client Gender Chart
  function createClientGenderChart() {
    const ctx = document.getElementById('clientGenderChart')?.getContext('2d');
    if (!ctx) return;

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

    if (window.clientGenderChart && typeof window.clientGenderChart.destroy === 'function') {
      window.clientGenderChart.destroy();
    }

    window.clientGenderChart = new Chart(ctx, config);

    // Live update simulation
    setInterval(function() {
      if (window.clientGenderChart) {
        const data = window.clientGenderChart.data.datasets[0].data;
        for (let i = 0; i < data.length; i++) {
          data[i] = Math.max(1, data[i] + Math.floor(Math.random() * 5) - 2);
        }
        window.clientGenderChart.update();
      }
    }, 6500);
  }

  // Create Client Language Chart
  function createClientLanguageChart() {
    const ctx = document.getElementById('clientLanguageChart')?.getContext('2d');
    if (!ctx) return;

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

    if (window.clientLanguageChart && typeof window.clientLanguageChart.destroy === 'function') {
      window.clientLanguageChart.destroy();
    }

    window.clientLanguageChart = new Chart(ctx, config);

    // Live update simulation
    setInterval(function() {
      if (window.clientLanguageChart) {
        const data = window.clientLanguageChart.data.datasets[0].data;
        for (let i = 0; i < data.length; i++) {
          data[i] = Math.max(1, data[i] + Math.floor(Math.random() * 3) - 1);
        }
        window.clientLanguageChart.update();
      }
    }, 7200);
  }

  // Create Client Registration Chart
  function createClientRegistrationChart() {
    const ctx = document.getElementById('clientAgeChart')?.getContext('2d');
    if (!ctx) return;

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

    if (window.clientRegistrationChart && typeof window.clientRegistrationChart.destroy === 'function') {
      window.clientRegistrationChart.destroy();
    }

    window.clientRegistrationChart = new Chart(ctx, config);

    // Live update simulation
    setInterval(function() {
      if (window.clientRegistrationChart) {
        const data = window.clientRegistrationChart.data.datasets[0].data;
        for (let i = 0; i < data.length; i++) {
          data[i] = Math.max(1, data[i] + Math.floor(Math.random() * 3) - 1);
        }
        window.clientRegistrationChart.update();
      }
    }, 6800);
  }

  // Update case assignment charts
  function updateCaseAssignmentCharts() {
    loadAllCases();
    createLawyerCaseLoadChart();
    createCasesTimelineChart();
  }

  // Create Lawyer Case Load Chart
  function createLawyerCaseLoadChart() {
    const ctx = document.getElementById('lawyerCaseLoadChart')?.getContext('2d');
    if (!ctx) return;

    const data = {
      labels: ['Lawyer A', 'Lawyer B', 'Lawyer C', 'Lawyer D', 'Lawyer E'],
      datasets: [{
        label: 'Cases Assigned',
        data: [5, 8, 3, 6, 4],
        backgroundColor: 'rgba(67, 97, 238, 0.7)',
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

    if (window.lawyerCaseLoadChart && typeof window.lawyerCaseLoadChart.destroy === 'function') {
      window.lawyerCaseLoadChart.destroy();
    }

    window.lawyerCaseLoadChart = new Chart(ctx, config);
  }

  // Create Cases Timeline Chart
  function createCasesTimelineChart() {
    const ctx = document.getElementById('casesTimelineChart')?.getContext('2d');
    if (!ctx) return;

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

    if (window.casesTimelineChart && typeof window.casesTimelineChart.destroy === 'function') {
      window.casesTimelineChart.destroy();
    }

    window.casesTimelineChart = new Chart(ctx, config);
  }

  // Update cases charts
  function updateCasesCharts() {
    createCasesStatusDistributionChart();
    createCasesTrendChart();
  }

  // Create Cases Status Distribution Chart
  function createCasesStatusDistributionChart() {
    const ctx = document.getElementById('casesStatusDistributionChart')?.getContext('2d');
    if (!ctx) return;

    const data = {
      labels: ['Active', 'Pending', 'Closed'],
      datasets: [{
        data: [35, 25, 40],
        backgroundColor: ['#4361ee', '#ffb703', '#6c757d'],
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

    if (window.casesStatusDistributionChart && typeof window.casesStatusDistributionChart.destroy === 'function') {
      window.casesStatusDistributionChart.destroy();
    }

    window.casesStatusDistributionChart = new Chart(ctx, config);
  }

  // Create Cases Trend Chart
  function createCasesTrendChart() {
    const ctx = document.getElementById('casesTrendChart')?.getContext('2d');
    if (!ctx) return;

    const data = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Cases',
        data: [10, 15, 12, 18, 20, 22, 16, 14, 25, 20, 22, 28],
        backgroundColor: 'rgba(67, 97, 238, 0.5)',
        borderColor: '#4361ee',
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

    if (window.casesTrendChart && typeof window.casesTrendChart.destroy === 'function') {
      window.casesTrendChart.destroy();
    }

    window.casesTrendChart = new Chart(ctx, config);
  }

  // Initialize on page load
  activateSection('dashboard');
  updateDashboardStats();
});
