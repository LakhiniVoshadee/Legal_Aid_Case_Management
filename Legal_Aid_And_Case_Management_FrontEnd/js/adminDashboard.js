$(document).ready(function() {
  const token = localStorage.getItem('token'); // Replace with your JWT token retrieval method

  // Function to load lawyers
  function loadLawyers() {
    if (!token) {
      $('#lawyers-tbody').html('<tr><td colspan="5" class="text-center text-danger">Please log in to view data.</td></tr>');
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
          const lawyers = response.data;
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
        } else {
          $('#lawyers-tbody').html('<tr><td colspan="5" class="text-center">No lawyers found</td></tr>');
        }
      },
      error: function(xhr) {
        $('#lawyers-loading').hide();
        $('#lawyers-tbody').html('<tr><td colspan="5" class="text-center text-danger">Error loading data. Please try again.</td></tr>');
        console.error('Error loading lawyers:', xhr);
      }
    });
  }

  // Function to load clients
  function loadClients() {
    if (!token) {
      $('#clients-tbody').html('<tr><td colspan="5" class="text-center text-danger">Please log in to view data.</td></tr>');
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
          const clients = response.data;
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
        } else {
          $('#clients-tbody').html('<tr><td colspan="5" class="text-center">No clients found</td></tr>');
        }
      },
      error: function(xhr) {
        $('#clients-loading').hide();
        $('#clients-tbody').html('<tr><td colspan="5" class="text-center text-danger">Error loading data. Please try again.</td></tr>');
        console.error('Error loading clients:', xhr);
      }
    });
  }

  // Tab switching logic
  $('#lawyers-tab').click(function(e) {
    e.preventDefault();
    $(this).tab('show');
    loadLawyers();
  });

  $('#clients-tab').click(function(e) {
    e.preventDefault();
    $(this).tab('show');
    loadClients();
  });

  // Initial load of lawyers when the page loads
  loadLawyers();

  // Optional: Handle "View" button clicks (e.g., show details in a modal)
  $(document).on('click', '.view-lawyer', function() {
    const lawyer = JSON.parse($(this).attr('data-lawyer'));
    alert('Lawyer Details:\nName: ' + lawyer.lawyer_name + '\nSpecialization: ' + lawyer.specialization);
    // Add modal logic here if desired
  });

  $(document).on('click', '.view-client', function() {
    const client = JSON.parse($(this).attr('data-client'));
    alert('Client Details:\nName: ' + client.full_name + '\nEmail: ' + client.email);
    // Add modal logic here if desired
  });
});
