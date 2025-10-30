// src/components/SuccessPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SuccessPage() {
	const navigate = useNavigate();
	const [results, setResults] = useState([]);
	const [editIndex, setEditIndex] = useState(null);
	const [editedData, setEditedData] = useState({});

	const call_user = async () => {
		navigate("/users");
	};
	const call_resulte = async () => {
		try {
			const response = await fetch(`http://127.0.0.1:8000/check-users/`, {
				method: "GET",
			});

			if (!response.ok) throw new Error("Users not found");
			navigate("/resulte");
		} catch (err) {
			console.error("Error updating policy:", err);
			alert("❌ Users not found: " + err.message);
		}
	};
	// Fetch policies
	useEffect(() => {
		fetch("http://127.0.0.1:8000/policies")
			.then((res) => res.json())
			.then((data) => setResults(data))
			.catch((err) => console.error("Failed to fetch results:", err));
	}, []);

	// Start editing
	const handleEdit = (i, parsed) => {
		setEditIndex(i);
		setEditedData(parsed);
	};

	// Update field locally
	const handleChange = (key, value) => {
		setEditedData((prev) => ({ ...prev, [key]: value }));
	};

	// Save updates to backend
	const handleSave = async (i) => {
		try {
			const updatedPolicy = editedData;
			const response = await fetch(`http://127.0.0.1:8000/policies/`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify([updatedPolicy]),
			});

			if (!response.ok) throw new Error("Failed to update policy");

			// Update local state
			const updatedResults = [...results];
			updatedResults[i] = updatedPolicy;
			setResults(updatedResults);
			setEditIndex(null);
			alert("✅ Policy updated successfully!");
		} catch (err) {
			console.error("Error updating policy:", err);
			alert("❌ Failed to update policy: " + err.message);
		}
	};

	const handleCancel = () => {
		setEditIndex(null);
		setEditedData({});
	};

	return (
		<div
			style={{
				width: "50%",
				height: "100vh",
				backgroundColor: "#f3f6fb",
				color: "#1f2937",
				overflow: "hidden",
				border: "1px solid red",
			}}
		>
			{/* Header */}
			<div
				style={{
					padding: "0.3rem",
					textAlign: "center",
					backgroundColor: "#e0f2fe",
					borderBottom: "2px solid #93c5fd",
				}}
			>
				<h1 style={{ color: "#0f766e", fontSize: "1.7rem" }}>✅ Upload Successful!</h1>
				<p style={{ color: "#0f172a", fontSize: "0.7rem" }}>
					Your JSON policies have been uploaded.
				</p>
				<div style={{
					display: "flex",
					justifyContent:"space-evenly"
				}}>

					<button
						onClick={call_user}
						style={{
							backgroundColor: "#2563eb",
							color: "white",
							border: "none",
							borderRadius: "6px",
							padding: "0.3rem 1rem",
							cursor: "pointer",
							fontWeight: "500",
							marginTop: "0.3rem",
							boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
						}}
						onMouseEnter={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
						onMouseLeave={(e) => (e.target.style.backgroundColor = "#2563eb")}
						>
						Upload users
					</button>
					<button
						onClick={call_resulte}
						style={{
							backgroundColor: "#2563eb",
							color: "white",
							border: "none",
							borderRadius: "6px",
							padding: "0.3rem 1rem",
							cursor: "pointer",
							fontWeight: "500",
							marginTop: "0.3rem",
							boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
						}}
						onMouseEnter={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
						onMouseLeave={(e) => (e.target.style.backgroundColor = "#2563eb")}
						>
						Check resultes
					</button>
				</div>
			</div>

			{/* Policy Cards */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					overflow: "scroll",
					height: "80%",
					scrollbarWidth: "thin",
					scrollbarColor: "#93c5fd #f3f6fb",
				}}
			>
				{results.map((p, i) => {
					const parsed = typeof p === "string" ? JSON.parse(p) : p;
					const isEditing = editIndex === i;
					return (
						<div
							key={i}
							style={{
								margin: "1rem",
								border: "1px solid #cbd5e1",
								borderRadius: "8px",
								padding: "1rem",
								backgroundColor: "#ffffff",
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								flexDirection: "column",
								boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
							}}
						>
							{Object.entries(parsed).map(([key, value]) => (
								<div
									key={key}
									style={{
										width: "100%",
										margin: "0.3rem",
										display: "flex",
										padding: "0.5rem",
										justifyContent: "space-between",
										alignItems: "center",
										color: "#1e293b",
										backgroundColor: "#f8fafc",
										borderRadius: "5px",
									}}
								>
									<strong style={{ color: "#2563eb" }}>{key}:</strong>

									{isEditing ? (
										<input
											type="text"
											value={editedData[key]}
											onChange={(e) => handleChange(key, e.target.value)}
											style={{
												width: "60%",
												padding: "0.3rem",
												borderRadius: "4px",
												border: "1px solid #cbd5e1",
											}}
										/>
									) : (
										<span>
											{typeof value === "object"
												? JSON.stringify(value)
												: value.toString()}
										</span>
									)}
								</div>
							))}

							{/* Buttons */}
							{isEditing ? (
								<div
									style={{
										marginTop: "0.5rem",
										display: "flex",
										gap: "0.5rem",
									}}
								>
									<button
										style={{
											backgroundColor: "#22c55e",
											color: "white",
											border: "none",
											borderRadius: "6px",
											padding: "0.3rem 0.8rem",
											cursor: "pointer",
											fontWeight: "500",
											boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
										}}
										onClick={() => handleSave(i)}
									>
										Save
									</button>

									<button
										style={{
											backgroundColor: "#ef4444",
											color: "white",
											border: "none",
											borderRadius: "6px",
											padding: "0.3rem 0.8rem",
											cursor: "pointer",
											fontWeight: "500",
											boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
										}}
										onClick={handleCancel}
									>
										Cancel
									</button>
								</div>
							) : (
								<button
									style={{
										marginTop: "0.5rem",
										backgroundColor: "#f59e0b",
										color: "white",
										border: "none",
										borderRadius: "6px",
										padding: "0.3rem 0.8rem",
										cursor: "pointer",
										fontWeight: "500",
										alignSelf: "flex-end",
										boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
									}}
									onMouseEnter={(e) =>
										(e.target.style.backgroundColor = "#d97706")
									}
									onMouseLeave={(e) =>
										(e.target.style.backgroundColor = "#f59e0b")
									}
									onClick={() => handleEdit(i, parsed)}
								>
									Edit Fields
								</button>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default SuccessPage;
