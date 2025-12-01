document.addEventListener('DOMContentLoaded', function() {
  var tabButtons = document.querySelectorAll('.tab-btn');
  var tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      var tabId = button.getAttribute('data-tab');

      tabButtons.forEach(function(btn) {
        btn.classList.remove('bg-slate-700/50', 'border-noyrax-blue', 'text-white');
        btn.classList.add('text-slate-400', 'border-transparent');
      });

      button.classList.remove('text-slate-400', 'border-transparent');
      button.classList.add('bg-slate-700/50', 'border-noyrax-blue', 'text-white');

      tabContents.forEach(function(content) { 
        content.classList.add('hidden'); 
      });
      
      var selectedTab = document.getElementById('tab-' + tabId);
      if (selectedTab) {
        selectedTab.classList.remove('hidden');
      }
    });
  });
});

