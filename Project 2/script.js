document.getElementById('client-type').addEventListener('change', function() {
    const otherTypeGroup = document.getElementById('other-type-group');
    if (this.value === 'other') {
        otherTypeGroup.style.display = 'block';
        // Add a small delay to ensure the display: block has taken effect
        setTimeout(() => {
            otherTypeGroup.classList.add('fade-in');
        }, 10);
        document.getElementById('other-type').required = true;
    } else {
        otherTypeGroup.classList.remove('fade-in');
        otherTypeGroup.style.display = 'none';
        document.getElementById('other-type').required = false;
    }
}); 