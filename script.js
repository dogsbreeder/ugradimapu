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
    
    // Proveri da li secretUrl uopšte postoji u localStorage (da nije potpuno obrisan)
    const secretUrlExists = localStorage.getItem('secretUrl') !== null;
    console.log('URL postoji u localStorage:', secretUrlExists);
    
    // Inicijalizuj adminLinkCode kao prazan string
    let adminLinkCode = '';
    
    // Samo ako URL zaista postoji u localStorage, pokušaj da ga dobiješ
    if (secretUrlExists) {
        // Dobavi URL iz localStorage-a
        let secretUrl = localStorage.getItem('secretUrl');
        console.log('Secret URL iz localStorage-a:', secretUrl);
        
        // Ako URL postoji i nije prazan, formatiraj ga i kreiraj admin link
        if (secretUrl && secretUrl.trim() !== '') {
            // Obradi URL
            if (secretUrl.startsWith('@')) {
                secretUrl = secretUrl.substring(1);
            }
            
            if (!secretUrl.startsWith('http://') && !secretUrl.startsWith('https://')) {
                secretUrl = 'https://' + secretUrl;
            }
            
            // Kreiraj admin link
            adminLinkCode = `<!-- Admin link -->
<div style="margin-top:5px; text-align:right; font-size:11px; color:#aaa;">
    <a href="${secretUrl}" rel="nofollow" style="color:#aaa; text-decoration:none;">Admin</a>
</div>`;
        }
    }
    
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
    ${adminLinkCode}
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