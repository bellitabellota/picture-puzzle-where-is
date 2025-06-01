import React from "react";
function SelectBoxContainer({clickedCoordinates, selectBox, targets, confirmTargetSelection}) {
  const targetOptions = targets.map((target) => <option value={target.name} key={target.name}>{target.name}</option>)

  return(
    <div className="select-box-container" style={{
      position: "absolute",
      top: `${clickedCoordinates.scaledY}px`,
      left: `${clickedCoordinates.scaledX}px`
    }}>
      <select name="selected-target" id="selected-target" ref={selectBox}>
        {targetOptions}
      </select>
      <button onClick={confirmTargetSelection}>OK</button>
    </div>
  )
}

export default SelectBoxContainer;