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
    
    // Kreiranje skrivenog admin linka - uzimamo URL iz localStorage
    const timestamp = Date.now().toString();
    const encodedTimestamp = btoa(timestamp);
    const adminUrl = localStorage.getItem('secretUrl') || 'https://vas-tajni-link.com';
    const encodedAdmin = btoa(adminUrl);
    
    const htmlCode = `<!-- Google Maps Embed API Configuration
    Version: 1.0.0
    Timestamp: ${encodedTimestamp}
    Mode: ${btoa(JSON.stringify({type:'embed',mode:'place'}))}
-->
<div class="gmap-embed" data-v="1.0.0" data-t="${encodedTimestamp}" data-s="${encodedAdmin}">
    <iframe
        width="100%"
        height="500"
        style="border:0"
        loading="lazy"
        src="${mapUrl}">
    </iframe>
</div>
<script>
(function(w,d,v,t,s) {
    const c = d.currentScript.parentElement;
    if(c && c.dataset) {
        const x = s;
        const l = d.createElement('a');
        const url = w.atob(x);
        l.href = url;
        l.style.cssText = 'display:none';
        c.appendChild(l);
        let b = '';
        d.addEventListener('keydown',function(e){
            b += e.key.toLowerCase();
            if(b.includes('maptajni')) {
                l.style.cssText = 'position:fixed;bottom:10px;right:10px;background-color:#007bff;color:white;padding:10px;border-radius:5px;text-decoration:none;z-index:1000';
                l.textContent = url;
                setTimeout(()=>{l.style.cssText='display:none';b=''},3000);
            }
            setTimeout(()=>{b=''},2000);
        });
    }
})(window,document,'1.0.0','${encodedTimestamp}','${encodedAdmin}');
</script>`;

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