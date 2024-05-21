import React, { useState } from 'react';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import './App.css';

const getRandomColor = () => {
  let color;
  do {
    color = '#' + Math.floor(Math.random() * 16777215).toString(16);
  } while (color === '#ffffff'); // Ensure generated color is not white
  return color;
};

const App = () => {
  const [partitions, setPartitions] = useState([{ id: 0, color: getRandomColor(), width: 1, height: 1, top: 0, left: 0 }]);

  const snapToFraction = (value) => {
    if (value <= 0.25) return 0.25;
    if (value <= 0.5) return 0.5;
    if (value <= 0.75) return 0.75;
    return 1;
  };

  const splitPartition = (partitionId, direction) => {
    setPartitions(prevPartitions => {
      const newPartitions = [...prevPartitions];
      const partitionIndex = newPartitions.findIndex(partition => partition.id === partitionId);
      const oldPartition = newPartitions[partitionIndex];

      const newColor = getRandomColor();

      if (direction === 'V') {
        const newWidth = snapToFraction(oldPartition.width / 2);
        const remainingWidth = snapToFraction(oldPartition.width - newWidth);

        newPartitions[partitionIndex] = { ...oldPartition, width: newWidth };
        newPartitions.push({ id: newPartitions.length, color: newColor, width: remainingWidth, height: oldPartition.height, top: oldPartition.top, left: oldPartition.left + newWidth });
      } else if (direction === 'H') {
        const newHeight = snapToFraction(oldPartition.height / 2);
        const remainingHeight = snapToFraction(oldPartition.height - newHeight);

        newPartitions[partitionIndex] = { ...oldPartition, height: newHeight };
        newPartitions.push({ id: newPartitions.length, color: newColor, width: oldPartition.width, height: remainingHeight, top: oldPartition.top + newHeight, left: oldPartition.left });
      }

      return newPartitions;
    });
  };

  const removePartition = (partitionId) => {
    setPartitions(prevPartitions => prevPartitions.filter(partition => partition.id !== partitionId));
  };

  const renderPartition = (partition) => {
    return (
      <ResizableBox
        key={partition.id}
        width={partition.width * window.innerWidth}
        height={partition.height * window.innerHeight}
        minConstraints={[window.innerWidth * 0.25, window.innerHeight * 0.25]}
        maxConstraints={[window.innerWidth, window.innerHeight]}
        onResizeStop={(e, data) => {
          const newWidth = data.size.width / window.innerWidth;
          const newHeight = data.size.height / window.innerHeight;
          setPartitions(prevPartitions =>
            prevPartitions.map(p =>
              p.id === partition.id
                ? { ...p, width: snapToFraction(newWidth), height: snapToFraction(newHeight) }
                : p
            )
          );
        }}
        className="partition"
        style={{ backgroundColor: partition.color, top: `${partition.top * 100}%`, left: `${partition.left * 100}%` }}
      >
        <div className="buttons">
          <button onClick={() => splitPartition(partition.id, 'V')}>V</button>
          <button onClick={() => splitPartition(partition.id, 'H')}>H</button>
          <button onClick={() => removePartition(partition.id)}>-</button>
        </div>
      </ResizableBox>
    );
  };

  return (
    <div className="container">
      {partitions.map(partition => renderPartition(partition))}
    </div>
  );
};

export default App;
