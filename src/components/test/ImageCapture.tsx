import React from 'react';
import html2canvas from 'html2canvas';

const ImageCapture = () => {
    const handleDownload = async () => {
        const canvas = await html2canvas(document.getElementById('capture') as HTMLElement, {
            useCORS: true, // Essential for images from external domains
            backgroundColor: 'white' // Sets the background color
        });
        const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        const link = document.createElement('a');
        link.download = 'rounded-image.png';
        link.href = image;
        link.click();
    };

    return (
        <div>
            <div id="capture" style={{
                backgroundImage: `url('https://setta.fi/rush-api/assets/card-art/hammer-waifu.png')`,
                backgroundSize: 'cover',
                borderRadius: '20px', // Rounded corners
                width: '500px',
                height: '500px',
                border: '10px solid white' // Adding white border
            }} />
            <button onClick={handleDownload}>Download Image</button>
        </div>
    );
};

export default ImageCapture;
