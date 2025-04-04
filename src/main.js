document.addEventListener('DOMContentLoaded', function() {
            // Güncel yıl 
const currentYear = new Date().getFullYear();
const copyrightText = document.querySelector('.footer-text');
copyrightText.innerHTML = copyrightText.innerHTML.replace('2023', currentYear);
            
            // Modal işlemleri
const modal = document.getElementById('teamModal');
const teamLink = document.getElementById('teamLink');
const closeBtn = document.getElementById('closeModal');
            
            // Modal açma
teamLink.addEventListener('click', function() {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Sayfayı kaydırmayı engelle
});
            
            // Modal kapatma
closeBtn.addEventListener('click', function() {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto'; // Sayfayı kaydırmayı etkinleştir
});
            
            // Modal dışına tıklayınca kapatma
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
});
            
            // ESC tuşuna basınca kapatma
window.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modal.classList.contains('show')) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        }
});

            // Scroll Up butonu işlemleri
const scrollUpBtn = document.getElementById('scrollUpBtn');
            
            // Sayfa kaydırıldığında butonu göster/gizle
window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
        scrollUpBtn.classList.add('show');
   } else {
        scrollUpBtn.classList.remove('show');
    }
});
            
            // Butona tıklandığında sayfanın en üstüne kaydır
scrollUpBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
         behavior: 'smooth'
    });
      });
});