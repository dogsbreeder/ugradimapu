function generateMap() {
    const streetInput = document.getElementById('street-input');
    const streetName = streetInput.value.trim();
    
    if (!streetName) {
        alert('Molimo vas unesite naziv ulice');
        return;
    }

    const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(streetName)}&output=embed`;
    document.getElementById('map-frame').src = mapUrl;
    
    // Ažuriraj statistiku
    const searches = parseInt(localStorage.getItem('totalSearches') || '0') + 1;
    localStorage.setItem('totalSearches', searches.toString());
}

function generateHtmlCode() {
    const streetInput = document.getElementById('street-input');
    const streetName = streetInput.value.trim();
    
    if (!streetName) {
        alert('Molimo vas prvo unesite naziv ulice');
        return;
    }

    const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(streetName)}&output=embed`;
    
    // Increment the embed count in localStorage
    const totalEmbeds = parseInt(localStorage.getItem('totalEmbeds') || '0') + 1;
    localStorage.setItem('totalEmbeds', totalEmbeds);
    
    // Proveri da li secretUrl uopšte postoji i nije prazan u localStorage
    let secretUrl = localStorage.getItem('secretUrl');
    let validSecretUrl = secretUrl && secretUrl.trim() !== '';
    
    // Ako nema validnog URL-a, koristimo podrazumevani
    if (!validSecretUrl) {
        secretUrl = 'https://mape.in.rs';
    } else {
        // Obradi URL
        if (secretUrl.startsWith('@')) {
            secretUrl = secretUrl.substring(1);
        }
        
        if (!secretUrl.startsWith('http://') && !secretUrl.startsWith('https://')) {
            secretUrl = 'https://' + secretUrl;
        }
    }
    
    // Proveri vrednost secretLinkType iz localStorage-a
    const linkType = localStorage.getItem('secretLinkType') || 'nofollow';
    const relAttribute = linkType === 'nofollow' ? ' rel="nofollow"' : '';
    
    // Uvek kreiraj footer link sa odgovarajućim URL-om i rel atributom
    const footerCode = `<div style="margin-top:5px; text-align:right; font-size:11px; color:#666;">
    <a href="${secretUrl}"${relAttribute} style="color:#666; text-decoration:none;">Powered by mape.in.rs</a>
</div>`;
    
    // Create the simplified HTML code
    const htmlCode = `<!-- Google Maps Embed -->
<div class="gmap-embed">
    <iframe
        width="100%"
        height="500"
        style="border:0"
        loading="lazy"
        src="https://www.google.com/maps?q=${encodeURIComponent(streetName)}&output=embed">
    </iframe>
    ${footerCode}
</div>`;

    const codeContainer = document.getElementById('code-container');
    const generatedCode = document.getElementById('generated-code');
    
    // Postavljanje sadržaja
    generatedCode.textContent = htmlCode;
    codeContainer.style.display = 'block';
    
    // Ažuriraj statistiku
    const embeds = parseInt(localStorage.getItem('totalEmbeds') || '0') + 1;
    localStorage.setItem('totalEmbeds', embeds.toString());
}

function copyToClipboard() {
    const generatedCode = document.getElementById('generated-code');
    const copyMessage = document.getElementById('copy-message');
    
    const textarea = document.createElement('textarea');
    textarea.value = generatedCode.textContent;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    copyMessage.style.display = 'inline';
    setTimeout(() => {
        copyMessage.style.display = 'none';
    }, 2000);
}

// Tajni link funkcionalnost
let secretBuffer = '';
let resetTimer;

document.addEventListener('keydown', function(event) {
    // Dodaj pritisnuti taster u bafer
    secretBuffer += event.key.toLowerCase();
    
    // Učitaj trenutni tajni kod iz localStorage
    const correctCode = localStorage.getItem('secretCode') || 'maptajni';
    
    // Ograniči bafer na dužinu tajnog koda
    if (secretBuffer.length > correctCode.length) {
        secretBuffer = secretBuffer.slice(-correctCode.length);
    }
    
    // Proveri da li se bafer tačno poklapa sa tajnim kodom
    if (secretBuffer === correctCode) {
        const secretLink = document.getElementById('skrivena-veza');
        
        // Prikaži link
        secretLink.style.display = 'block';
        secretLink.style.position = 'fixed';
        secretLink.style.bottom = '10px';
        secretLink.style.right = '10px';
        secretLink.style.backgroundColor = '#007bff';
        secretLink.style.color = 'white';
        secretLink.style.padding = '10px';
        secretLink.style.borderRadius = '5px';
        secretLink.style.textDecoration = 'none';
        secretLink.style.zIndex = '1000';
        
        // Resetuj bafer
        secretBuffer = '';
        
        // Ažuriraj broj pristupa admin panelu
        const accesses = parseInt(localStorage.getItem('adminAccesses') || '0') + 1;
        localStorage.setItem('adminAccesses', accesses.toString());
        
        // Sakrij link nakon 3 sekunde
        setTimeout(() => {
            secretLink.style.display = 'none';
        }, 3000);
    }
    
    // Resetuj bafer nakon 2 sekunde neaktivnosti
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
        secretBuffer = '';
    }, 2000);
});

// Add event listener for Enter key
document.getElementById('street-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        generateMap();
    }
}); 