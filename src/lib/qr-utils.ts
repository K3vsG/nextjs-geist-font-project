import QRCode from 'qrcode';

export const generateQRCode = async (data: string): Promise<string> => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

export const downloadQRCode = (dataURL: string, filename: string) => {
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = `${filename}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateVisitQRData = (visitId: string, visitorName: string, apartment: string, date: string) => {
  return JSON.stringify({
    visitId,
    visitorName,
    apartment,
    date,
    residencia: 'Residencial Vista Hermosa',
    type: 'visit'
  });
};

export const parseQRData = (qrData: string) => {
  try {
    return JSON.parse(qrData);
  } catch (error) {
    console.error('Error parsing QR data:', error);
    return null;
  }
};
