// search-ui.js - Arama arayüzü için JavaScript kodu

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const yearDropdownBtn = document.getElementById('year-dropdown-btn');
    const yearDropdownContent = document.getElementById('year-dropdown-content');
    const yearDropdownContainer = document.querySelector('.year-dropdown-container');
    const yearOptions = document.querySelectorAll('.year-option');
    
    // Catalog.js'den alınan değişkenlere erişim
    let selectedYear = '';
    
    // Search input'a tıklandığında, genişlet ve yıl dropdown'ını göster
    searchInput.addEventListener('focus', () => {
        searchInput.classList.add('expanded');
        yearDropdownContainer.classList.add('visible');
    });
    
    // Year dropdown butonuna tıklandığında dropdown içeriğini aç/kapat
    yearDropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Tıklama event'inin document'a gitmesini önle
        yearDropdownContent.classList.toggle('show');
    });
    
    // Dokümanda herhangi bir yere tıklandığında ve bu arama alanı değilse
    document.addEventListener('click', (e) => {
        // Eğer tıklanan eleman search input, year dropdown veya bunların içindeki bir element değilse
        const isSearchRelated = e.target.closest('#search-input') || 
                               e.target.closest('.year-dropdown-container') ||
                               e.target.closest('.search-button');
        
        // Dropdown içeriğini kapat
        if (!e.target.matches('#year-dropdown-btn') && !e.target.matches('.dropdown-arrow')) {
            yearDropdownContent.classList.remove('show');
        }
        
        // Eğer arama ilişkili değilse ve input boşsa, arama çubuğunu küçült
        if (!isSearchRelated) {
            if (!searchInput.value.trim()) {
                searchInput.classList.remove('expanded');
                yearDropdownContainer.classList.remove('visible');
            }
        }
    });
    
    // Input'a değer girildiğinde expanded sınıfını koru
    searchInput.addEventListener('input', () => {
        if (searchInput.value.trim()) {
            searchInput.classList.add('expanded');
            yearDropdownContainer.classList.add('visible');
        }
    });
    
    // Yıl seçimi
    yearOptions.forEach(option => {
        option.addEventListener('click', () => {
            const year = option.getAttribute('data-year');
            
            if (year === '') {
                // Tümü seçeneği seçildiğinde
                selectedYear = '';
                yearDropdownBtn.innerHTML = 'Year <span class="dropdown-arrow">▼</span>';
            } else {
                selectedYear = year;
                yearDropdownBtn.innerHTML = year + ' <span class="dropdown-arrow">▼</span>';
            }
            
            // Tüm seçeneklerden selected class'ını kaldır
            yearOptions.forEach(opt => opt.classList.remove('selected'));
            // Seçilen seçeneğe selected class'ı ekle
            option.classList.add('selected');
            
            yearDropdownContent.classList.remove('show');
            
            // Arama fonksiyonunu çağır - window üzerinden catalog.js'deki searchMovies fonksiyonuna erişim
            if (window.searchMovies) {
                window.searchMovies(searchInput.value.trim(), 1, selectedYear);
            } else {
                console.error('searchMovies fonksiyonu bulunamadı!');
                // searchMovies fonksiyonu yoksa, form submit eventini tetikle
                const event = new Event('submit');
                document.getElementById('search-form').dispatchEvent(event);
            }
        });
    });
});
