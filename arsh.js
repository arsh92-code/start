let localStream;
let peerConnection;
const servers = {
    iceServers: [
        {
            urls: 'stun:stun.l.google.com:19302' // Using a free STUN server
        }
    ]
};

const startCallButton = document.getElementById('startCall');
const endCallButton = document.getElementById('endCall');
const callStatus = document.getElementById('callStatus');

// Start the call function
function startCall() {
    // Request access to audio (and optionally video)
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            localStream = stream;

            // Set up PeerConnection
            peerConnection = new RTCPeerConnection(servers);
            peerConnection.addStream(localStream);

            // Create an offer and set local description
            peerConnection.createOffer()
                .then(offer => peerConnection.setLocalDescription(offer))
                .then(() => {
                    // Here you would send the offer to the remote peer using signaling
                    console.log('Offer created and sent to peer');
                    callStatus.innerText = 'Calling...';
                });

            // When remote stream is added
            peerConnection.ontrack = event => {
                const remoteAudio = new Audio();
                remoteAudio.srcObject = event.streams[0];
                remoteAudio.play();
                callStatus.innerText = 'Connected!';
            };

            startCallButton.style.display = 'none';
            endCallButton.style.display = 'inline-block';
        })
        .catch(error => {
            console.error('Error accessing media devices.', error);
        });
}

// End the call function
function endCall() {
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
        callStatus.innerText = 'Call ended';
    }

    startCallButton.style.display = 'inline-block';
    endCallButton.style.display = 'none';
}
