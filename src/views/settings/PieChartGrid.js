// import { ResponsivePie } from '@nivo/pie';
// import ChartCustomTheme from './ChartTheme';

// const PieChartGrid = ({ datasets }) => {

//     return (
//         <div
//             style={{
//                 maxWidth: '100vw',
//                 height: '450px',
//                 overflowX: 'auto',
//                 whiteSpace: 'nowrap', // Prevent wrapping
//                 padding: '10px',
//                 border: '1px solid #333',
//                 borderRadius: '8px',
//             }}
//         >
//             <div
//                 style={{
//                     display: 'grid',
//                     gridAutoFlow: 'column', // Arrange items in a row
//                     gridAutoColumns: 'minmax(300px, 1fr)', // Minimum width for each grid item
//                     gap: '20px',
//                 }}
//             >
//                 {datasets.map((dataset, index) => (
//                     <div key={index} style={{ width: '300px', height: '400px' }}>
//                         <h5 style={{ margin: '10px 0', textAlign: 'center' }}>{dataset.label}</h5>
//                         <ResponsivePie
//                             data={dataset.data}
//                             margin={{ top: 0, right: 20, bottom: 50, left: 20 }}
//                             innerRadius={0.5}
//                             padAngle={0.7}
//                             cornerRadius={3}
//                             activeOuterRadiusOffset={8}
//                             borderWidth={1}
//                             borderColor={{
//                                 from: 'color',
//                                 modifiers: [['darker', 0.2]],
//                             }}
//                             arcLinkLabelsSkipAngle={360}
//                             arcLabelsSkipAngle={30}
//                             legends={[
//                                 {
//                                     anchor: 'bottom',
//                                     direction: 'row',
//                                     justify: false,
//                                     translateX: 0,
//                                     translateY: 20,
//                                     itemsSpacing: 0,
//                                     itemWidth: 70,
//                                     itemHeight: 10,
//                                     itemTextColor: '#999',
//                                     itemDirection: 'left-to-right',
//                                     itemOpacity: 1,
//                                     symbolSize: 18,
//                                     symbolShape: 'circle',
//                                     effects: [
//                                         {
//                                             on: 'hover',
//                                             style: {
//                                                 itemTextColor: '#000',
//                                             },
//                                         },
//                                     ],
//                                 },
//                             ]}
//                             theme={ChartCustomTheme}
//                         />
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default PieChartGrid;