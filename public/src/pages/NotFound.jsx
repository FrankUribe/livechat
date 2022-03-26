import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
	const [timeLeft, setTimeLeft] = useState(null);
	useEffect(() => {
    if(timeLeft===0){
       setTimeLeft(null)
			 navigate("/")
    }
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);
	useEffect(() => {
		setTimeLeft(5)
	},[])
	
  return (
    <div className="nfContainer"
    style={{
			display: "flex",
  		flexDirection: "column",
			justifyContent: "center",
			alignItems: "center",
			width: "100vw",
			height: "100vh",
    }}>
      <h1>Página no encontrada</h1>
			<p>Seras redirigido en {timeLeft}</p>
			<Link to="/"
				style={{
					border: "solid 2px #007dff",
					backgroundColor: "#007dff",
					color: "#ffffff",
					fontWeight: "600",
					cursor: "pointer",
					transition: "0.3s ease-in-out",
					textDecoration: "none",
					padding: "8px",
					marginTop: "10px",
					borderRadius: "5px",
				}}
			>Volver a chat</Link>
    </div>
  )
}
