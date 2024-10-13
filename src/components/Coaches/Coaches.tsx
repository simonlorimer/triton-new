import React, { useState, useEffect } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Coaches.scss';

interface StaffMemberImage {
  url: string;
  title: string;
}

interface StaffMember {
  fullName: string;
  jobTitle: string;
  description: string;
  staffMemberImage: StaffMemberImage;
  displayOrder: number;
}

var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
  };

function App() {
  const query = `
    {
      staffMemberCollection {
        items {
          fullName
          jobTitle
          description
          staffMemberImage {
            url
            title
          }
          displayOrder
        }
      }
    }
  `;
  
  const [page, setPage] = useState<StaffMember[] | null>(null);

  useEffect(() => {
    window
      .fetch(`https://graphql.contentful.com/content/v1/spaces/[SPACE_ID]/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authenticate the request
          Authorization: "Bearer [ACCESS_TOKEN]",
        },
        // send the GraphQL query
        body: JSON.stringify({ query }),
      })
      .then((response) => response.json())
      .then(({ data, errors }) => {
        if (errors) {
          console.error(errors);
        }

        setPage(data.staffMemberCollection.items.sort());
      });
  }, [query]);

  // show a loading screen case the data hasn't arrived yet
  if (!page) {
    return (<p>Loading...</p>);
  }

  return (
    <div className="coaches">
      <Slider {...settings}>
      {page.map((item: StaffMember) => {
          return (
            <div className="profile">
              <h2>{item.fullName}</h2>
              <h3>{item.jobTitle}</h3>
              <p>{item.description}</p>
              <img className="profilePicture" src={item.staffMemberImage.url} alt={item.staffMemberImage.title} />
            </div>
          )})}
      </Slider>
    </div>
  );
}

export default App;
