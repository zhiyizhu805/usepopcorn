import { useState, useEffect } from "react";

export default function StarRating() {
  //   const arrayOfStars = Array.from({ length: 10 }, (_, i) => i + 1);
  const initializeMap = (size) => {
    const map = new Map();
    for (let i = 1; i <= size; i++) {
      map.set(i, false);
    }
    return map;
  };
  const [myMap, setMyMap] = useState(initializeMap(10));
  const [ratedStars, setRatedStars] = useState(0);
//   console.log("myMap", myMap);
  const handleMouseEnter = (key) => {
    const newMap = new Map(myMap);
    newMap.forEach((value, k) => {
      if (k <= key) {
        newMap.set(k, true);
      } else {
        newMap.set(k, false);
      }
    });
    setMyMap(newMap);
  };
  const countTrueValues = (map) => {
    let count = 0;
    map.forEach((value) => {
      if (value) {
        count++;
      }
    });
    return count;
  };

  useEffect(() => {
    setRatedStars(countTrueValues(myMap));
  }, [myMap]);

  return (
    <div>
      <div>
        {[...myMap.entries()]?.map(([key, value]) => (
          <Star
            isRated={value}
            key={key}
            onMouseEnter={() => handleMouseEnter(key)}
          />
        ))}
        <span>{ratedStars}</span>
      </div>
      <button>➕ Add to list</button>
    </div>
  );
}

function Star({ isRated = false, onMouseEnter }) {
  return isRated === false ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-star"
      viewBox="0 0 16 16"
      onMouseEnter={onMouseEnter}
    >
      <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z" />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-star-fill"
      viewBox="0 0 16 16"
      onMouseEnter={onMouseEnter}
    >
      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
    </svg>
  );
}
