import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';

import consultApi from '../../services/consultApi';

export default function Whatsapp() {
    const [conectado, setConectado] = useState(false);
    const [qrCode, setQrCode] = useState('');
    const nav = useNavigate();

    useEffect(() => {
        consultApi(nav, 'get', '/admin/whatsapp');

        const eventSource = new EventSource('http://localhost:3000/admin/whatsapp/qr');

        eventSource.onmessage = function (event) {
            if (event.data === 'Pronto') {
                eventSource.close();
                setConectado(true);
                return;
            }

            try {
                const imageBase64 = event.data;
                setQrCode(imageBase64);
            } catch (e) {
                console.error('Erro ao parsear JSON:', e);
            }
        };

        eventSource.onerror = function (err) {
            console.error('Erro SSE:', err);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, []);

    return (
        <>
            <p>Whatsapp</p>
            {(!conectado && qrCode) && <img src={qrCode} alt='qrcode' />}
        </>
    );
}