import React, { useState, useEffect } from 'react';
import './App.css';

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

function App() {
  const query = `
    {
      staffMemberCollection  {
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
  
  const [page, setPage] = useState<StaffMember | null>(null);

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

        setPage(data.staffMemberCollection.items[0]);
      });
  }, [query]);

  // show a loading screen case the data hasn't arrived yet
  if (!page) {
    return (<p>Loading...</p>);
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>{page.fullName}</p>
        <p>{page.jobTitle}</p>
        <p>{page.description}</p>
        <img src={page.staffMemberImage.url} alt={page.staffMemberImage.title}/>
        <p>{page.displayOrder}</p>
      </header>
    </div>
  );
}

export default App;
