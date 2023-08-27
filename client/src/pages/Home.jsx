import { useEffect, useRef, useState } from "react";
import styled from "styled-components"
import { GlobalContext } from "../context/GlobalContext";
import { useContext } from "react";

const Home = () => {
    const { userName, handleLogout } = useContext(GlobalContext);

    const [permission, setPermission] = useState({ video: false, audio: false, screen: false })
    const [preference, setPreference] = useState({ video: false, audio: false, screen: false })

    const videoRef = useRef(null);
    const screenRef = useRef(null);
    const [recording, setRecording] = useState(false);

    const [cameraStream, setCameraStream] = useState(null);
    const [cameraRecorder, setCameraRecorder] = useState(null);
    const [cameraBlobUrl, setCameraBlobUrl] = useState(null);

    const [screenStream, setScreenStream] = useState(null);
    const [screenRecorder, setScreenRecorder] = useState(null);
    const [screenBlobUrl, setScreenBlobUrl] = useState(null);

    const [audioStream, setAudioStream] = useState(null);
    const [audioRecorder, setAudioRecorder] = useState(null);
    const [audioBlobUrl, setAudioBlobUrl] = useState(null);
    function updatePermission() {
        navigator.getUserMedia(
            { video: true, audio: true },

            (stream) => {
                stream.getTracks().forEach(x => x.stop())
                setPermission((prev) => ({ ...prev, video: true, audio: true }))
            },
            err => setPermission((prev) => ({ ...prev, video: false, audio: false }))
        )
    }

    useEffect(() => {
        updatePermission()
    }, [])

    // const [dots, setDots] = useState("...");
    // useEffect(() => {
    //     const interval= setInterval(()=>{

    //         if(dots && dots==="."){
    //             setDots("..")
    //         }
    //         if(dots && dots===".."){
    //             setDots("...")
    //         }
    //         if(dots && dots==="..."){
    //             setDots(".")
    //         }
    //     },500)


    //     return()=>{
    //         clearInterval(interval)
    //     }
    // }, [dots])








    const startCameraRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks = [];

        recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                chunks.push(event.data);
            }
        };

        recorder.onstop = () => {
            const cameraBlob = new Blob(chunks, { type: 'video/webm' });
            const blobUrl = URL.createObjectURL(cameraBlob);
            setCameraBlobUrl(blobUrl);
        };

        setCameraStream(stream);
        setCameraRecorder(recorder);
        videoRef.current.srcObject = stream;
        recorder.start();
    };
    const startAudioRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks = [];

        recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                chunks.push(event.data);
            }
        };

        recorder.onstop = () => {
            const audioBlob = new Blob(chunks, { type: 'audio/wav' });
            const blobUrl = URL.createObjectURL(audioBlob);
            setAudioBlobUrl(blobUrl);
        };

        setAudioStream(stream);
        setAudioRecorder(recorder);
        recorder.start();
    };


    const startScreenRecording = async () => {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const recorder = new MediaRecorder(stream);
        const chunks = [];

        recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                chunks.push(event.data);
            }
        };

        recorder.onstop = () => {
            const screenBlob = new Blob(chunks, { type: 'video/webm' });
            const blobUrl = URL.createObjectURL(screenBlob);
            setScreenBlobUrl(blobUrl);
        };

        setScreenStream(stream);
        setScreenRecorder(recorder);
        screenRef.current.srcObject = stream;
        recorder.start();
    };

    const startRecording = () => {
        if (preference.video) {
            startCameraRecording();
        }
        if (preference.audio) {
            startAudioRecording();
        }
        if (preference.screen) {
            startScreenRecording();
        }
        setRecording(true);
    };


    const stopRecording = () => {
        if (cameraRecorder) {
            cameraRecorder.stop();
            cameraStream.getTracks().forEach((track) => track.stop());
        }

        if (audioRecorder) {
            audioRecorder.stop();
            audioStream.getTracks().forEach((track) => track.stop());
        }

        if (screenRecorder) {
            screenRecorder.stop();
            screenStream.getTracks().forEach((track) => track.stop());
        }

        setRecording(false);
        setCameraRecorder(null);
        setScreenRecorder(null);
    };

    const handleDownloadCameraRecording = () => {
        if (cameraBlobUrl) {
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = cameraBlobUrl;
            a.download = 'camera-recording.webm';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(cameraBlobUrl);
        }
    };
    const handleDownloadAudioRecording = () => {
        if (audioBlobUrl) {
            console.log("downloaded screen");
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = audioBlobUrl;
            a.download = 'audio-recording.wav';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(audioBlobUrl);
        }
    };
    const handleDownloadScreenRecording = () => {
        if (screenBlobUrl) {
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = screenBlobUrl;
            a.download = 'screen-recording.webm';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(screenBlobUrl);
        }
    };


    return (
        <StyledHome>
            <div className="navbar">
                <span>Hello,<b>{userName}</b></span>
                <div className="logout" onClick={handleLogout}>logout</div>
            </div>
            <div className="flex">

                <div className={recording ? "start-recording animate" : "start-recording"}>Start Recording</div>
                {/* <span className={recording?"dots animate":"dots"}>...</span> */}
                <div className="options">
                    <div>
                        <label htmlFor="video">video</label>
                        <input onClick={() => setPreference((prev) => ({ ...prev, video: !preference.video }))} value={preference.video} type="checkbox" name="video" id="video" className="video" />
                    </div>
                    <div>
                        <label htmlFor="audio">audio</label>
                        <input onClick={() => setPreference((prev) => ({ ...prev, audio: !preference.audio }))} type="checkbox" name="audio" id="audio" className="audio" />
                    </div>
                    <div>
                        <label htmlFor="screen">screen</label>
                        <input onClick={() => setPreference((prev) => ({ ...prev, screen: !preference.screen }))} type="checkbox" name="screen" id="screen" className="screen" />
                    </div>
                </div>
                <div className="rec-btn-container">
                    <div className={(preference.video || preference.audio || preference.screen) ? "rec-btn" : "rec-btn disabled"}>
                        {!recording ? (
                            <div className="play" onClick={startRecording} ><span className="material-symbols-outlined">play_arrow</span></div>
                        ) : (
                            <div className="pause" onClick={stopRecording} ><span className="material-symbols-outlined">pause</span></div>
                        )}
                    </div>
                </div>
                <div className={recording?"download disabled":"download"} >
                    {preference.video && <span onClick={handleDownloadCameraRecording}>download video</span>}
                    {preference.audio && <span onClick={handleDownloadAudioRecording}>download audio</span>}
                    {preference.screen && <span onClick={handleDownloadScreenRecording}>download screenRecording</span>}
                </div>
                <div className="videos-panels" >
                    <video ref={videoRef} autoPlay muted />
                    <video ref={screenRef} autoPlay muted />
                </div>
            </div>
        </StyledHome>
    );
}
const StyledHome = styled.div`
    background: #f0f0f0;
    .navbar{
        height: 70px;
        display: flex;
        flex-direction: column  ;
        justify-content: center;
        /* align-items: center; */

    }

    .navbar span{
        font-size: 1.5rem;
        margin:0 32px 0 auto;
        color: #3c3c3c;
    }
    .navbar .logout{
        color: blue;
        text-decoration: underline;
        cursor: pointer;
        margin:0 32px 0 auto;

    }
    .options{
        display: flex;
    }
    .options >div{
        display: flex;
        align-items: center;
        margin: 4px;
        font-size: 1.3rem;
        user-select: none;
    }
    .options input{
        width: 20px;
        height: 20px;
    }
    .flex{
        height: calc(100dvh - 70px);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-weight: bold;
    }
    .flex .start-recording{
        font-size: 1.6rem;
        color: #3c3c3c;

    }
    .rec-btn.disabled {
        pointer-events: none;
        display: none;
        
    }
    .rec-btn{
        width: min-content;
        margin: 10px auto;
        width: 50px;
        height: 50px;
        border: 3px solid #e4e4e4;
    }
    .rec-btn > div > span{ 
        font-size: 3rem;
        position: absolute;
        user-select: none;
        cursor: pointer;
        transition: 1s cubic-bezier(0.075, 0.82, 0.165, 1);
    }
    .download span:hover{
        text-decoration: underline;
    }
    .download.disabled span{
        pointer-events: none;
        opacity: 0.5;
    }
    .download span{
        margin: 8px;
        display: block;
        cursor: pointer;
    }
    .videos-panels video{
        aspect-ratio: 16/9;
        object-fit: contain;
        width: 50%;
        margin:2px;
        border: 1px solid #3c3c3c;
    }
    .videos-panels{
        width: 70%;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        /* display: none; */
    }
    @media screen and (max-width:800px){
        .videos-panels{
            flex-direction: column;
            width: 90%;
        }
    }
    .start-recording{
        position: relative;
    }
    .start-recording:after{
        content: "...";
        font-size: 1.6rem;
        position: absolute;
        transform: translateX(5px);
        top: 0;
    }
    .dots{
        display: block;
        width: 15px;
        overflow: hidden;
    }
    .animate:after{
        animation: dotsAnimation 3s infinite steps(3);
    }
    @keyframes dotsAnimation{
        0%{
            content: ".";
            
        }
        50%{
            content: "..";
        }
        100%{
            content: "...";
        }
    }
    @media screen and (max-width:460px){
        .navbar span{
            font-size: 1.2rem;
            margin:0 16px 0 auto;
        }
    }
`



export default Home;