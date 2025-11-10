// import React from "react";
// import axios from "axios";

// const DistressTable = ({ distressList, onAction }) => {
//   const token = localStorage.getItem("token");

//   const updateStatus = async (id, status) => {
//     try {
//       await axios.patch(
//         `http://localhost:5000/distress/${id}`,
//         { status },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       onAction(); // refresh
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="table-container">
//       <h3>All Distress Reports</h3>
//       <table>
//         <thead>
//           <tr>
//             <th>Node ID</th>
//             <th>Message</th>
//             <th>Coordinates</th>
//             <th>Status</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {distressList.map((item) => (
//             <tr key={item._id}>
//               <td>{item.nodeId}</td>
//               <td>{item.message}</td>
//               <td>
//                 {item.coordinates.map((c, i) => (
//                   <span key={i}>
//                     ({c.lat}, {c.long}){" "}
//                   </span>
//                 ))}
//               </td>
//               <td>{item.status}</td>
//               <td>
//                 <button
//                   onClick={() =>
//                     updateStatus(item._id, item.status === "Pending" ? "Addressed" : "Pending")
//                   }
//                 >
//                   {item.status === "Pending" ? "Mark Addressed" : "Mark Pending"}
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default DistressTable;

// import React from "react";

// const DistressTable = ({ distressList }) => {
//   return (
//     <div className="table-container">
//       <h3>All Distress Reports</h3>
//       <table>
//         <thead>
//           <tr>
//             <th>Node ID</th>
//             <th>Seq No</th>
//             <th>Message</th>
//             <th>Latitude</th>
//             <th>Longitude</th>
//           </tr>
//         </thead>
//         <tbody>
//           {distressList.map((item) => (
//             <tr key={item._id}>
//               <td>{item.nodeID}</td>
//               <td>{item.seqNo}</td>
//               <td>{item.message}</td>
//               <td>{item.lat}</td>
//               <td>{item.lng}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default DistressTable;


// import React from "react";

// const DistressTable = ({ distressList }) => {
//   return (
//     <div className="table-container">
//       <h3>All Distress Alerts</h3>
//       <table className="distress-table">
//         <thead>
//           <tr>
//             <th>Distress ID</th>
//             <th>Message</th>
//             <th>Hops Count</th>
//             <th>Last Node</th>
//             <th>Last Seen (Lat, Lng)</th>
//           </tr>
//         </thead>
//         <tbody>
//           {distressList.map((item) => {
//             const lastHop = item.path[item.path.length - 1];
//             return (
//               <tr key={item._id}>
//                 <td>{item.distressID}</td>
//                 <td>{item.message}</td>
//                 <td>{item.path.length}</td>
//                 <td>{lastHop?.nodeID}</td>
//                 <td>{lastHop?.lat}, {lastHop?.lng}</td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default DistressTable;
