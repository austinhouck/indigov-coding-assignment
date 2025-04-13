# Indigov Coding Assignment

# Problem

Indigov is a constituent management system that allows elected officials to manage their constituency. A newly elected official is planning on holding a town hall meeting and is setting up a digital tablet to collect contact information from constituents that would like to sign up to the official’s newsletter on a tablet at the door. The email addresses, names, and address information about the constituents would be submitted to Indigov for storage. The official already has about 500 constituents in their database, and it is very important to them that any duplicates are merged during the contact gathering process.

# Requirements

Please set up a service that can store the existing constituents. The service should allow the official to:

1. List all the constituents that are currently in the system
2. Submit new constituent contact data (without creating duplicates)
3. Export a csv file of constituent contact data filtered by sign up time

During the constituent contact submission process, any duplicate constituents should be merged. You can use the constituent’s email address as a unique identifier.

# Tech stack

At Indigov, we’re heavy on Typescript, Node, and React, so we ask that you use some of these technologies to best allow your interviewer to dive deeper into the specifics of your solution. There is no need to optimize for scalability at this point, but you may want to think about how your solution would change if it were to handle millions of constituents or high volumes of submissions. You can use any sort of data store to “persist” the constituents (database, csv on disk, memory, etc).

# What we are looking for:

- A back-end solution: a solid functional service that can receive REST calls
- Instructions on how to run the app
- Be prepared to describe your thought process and tradeoffs you made
- It’s okay to stub or mock out pieces you don’t have time to get to
- It’s encouraged to bring in libraries you are comfortable with
- If you have extra time, feel free to add additional features that you find interesting

# Extra points (totally not necessary):
- Making a frontend that looks snazzy
- Add search, sort, and/or filter functionality to the list of constituents in the system
- Add the ability to upload CSVs of contact data to the system
- Thorough validation of incoming data
- Authentication and other security features
