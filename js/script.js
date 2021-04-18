const postLink = "https://jsonplaceholder.typicode.com/posts";
const userLink = "https://jsonplaceholder.typicode.com/users";

const first = document.querySelector(".firstPart");
const second = document.querySelector(".secondPart");
const third = document.querySelector(".thirdPart");

const findNearest = (user, usersData) => {
  const geo = user.address.geo;
  const difference = [];

  usersData.forEach((person) => {
    if (person !== user) {
      const latDifference = Math.abs(geo.lat - person.address.geo.lat);
      const lngDifference = Math.abs(geo.lng - person.address.geo.lng);
      const distance = Math.sqrt(
        Math.pow(latDifference, 2) + Math.pow(lngDifference, 2)
      );
      difference.push({
        personId: person.id,
        distance: distance,
      });
    }
  });

  const distanceArr = difference.map((elem) => elem.distance);
  const minDistance = Math.min(...distanceArr);
  const nearestPerson = difference.find((elem) => {
    return elem.distance === minDistance;
  });

  return usersData.find((item) => {
    return item.id === nearestPerson.personId;
  });
};

const getData = () => {
  axios.get(postLink).then((res) => {
    const postsData = res.data;
    axios.get(userLink).then((res) => {
      const usersData = res.data;
      const fullData = usersData.map((user) => {
        return {
          ...user,
          post: [...postsData.filter((post) => post.userId === user.id)],
        };
      });

      for (let i = 0; i < fullData.length; i++) {
        const p = document.createElement("p");
        p.textContent += `${fullData[i].username} napisał(a) ${fullData[i].post.length} postów.  `;
        first.append(p);
      }

      const titleArr = [];

      //   postsData[1].title = postsData[13].title;
      //   postsData[2].title = postsData[13].title;
      //   postsData[3].title = postsData[13].title;

      for (let i = 0; i < postsData.length; i++) {
        titleArr.push(postsData[i].title);
      }

      const duplicates = titleArr.reduce(function (acc, el, i, arr) {
        if (arr.indexOf(el) !== i && acc.indexOf(el) < 0) acc.push(el);
        return acc;
      }, []);

      const duplicatedObj = [];
      if (duplicates.length > 0) {
        for (let i = 0; i < duplicates.length; i++) {
          for (let j = 0; j < postsData.length; j++) {
            if (duplicates[i] === postsData[j].title) {
              duplicatedObj.push(postsData[j]);
            }
          }
        }
        const p = document.createElement("p");
        p.textContent += `Tytuły zduplikowane to: `;
        second.append(p);

        duplicatedObj.forEach((item) => {
          const p = document.createElement("p");
          p.textContent += `"${item.title}" o id ${item.id}`;
          second.append(p);
        });
      } else {
        const p = document.createElement("p");
        p.textContent += `Tytuły nie powtarzają się.`;
        second.append(p);
      }

      usersData.forEach((user, index) => {
        const p = document.createElement("p");
        const nearestUser = findNearest(user, usersData);
        p.textContent += `Najbliżej położony(a) od użytkownika ${usersData[index].name} jest użytkownik ${nearestUser.name}`;
        third.append(p);
      });
    });
  });
};

getData();
