[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=21251547&assignment_repo_type=AssignmentRepo)
# CS2701: Group Project 2025/26

## Section 1 – Startup Information

### Group number: Group B20
### Start-up: Start-up 1
### Tutor: Dr Isabel Sassoon

### Start-up Members
| Name | Student ID | Contribution |
|------|------------|--------------|
| Zaara Ahad | 2456462 | Lean Canvas, Sprint backlog |
| Mikhail Babunashvili | 2222815 | GitHub setup, README setup (creation of bootstrap) |
| Oleksandra Denysenko | 2412048 | Project backlog, first sprint plan, organisation of meetings |
| Antonio-Andrei Dutu | 2329682 | Peer review |

---

## Section 2 – Project Idea and Vision

### UN Sustainable Development Goal number: 11 Sustainable Cities & Communities

### Assigned Problem Statement
Local artists and cultural projects often go unnoticed, losing spaces to share and sustain their work. The project addresses the difficulty artists encounter in securing accessible and reasonably priced venues for exhibiting their work. Artists can create an account and book a place through the platform, and the interactive map assists them in finding appropriate locations. Success lowers the time and effort now spent looking for venues by enabling artists to quickly find and acquire exhibition opportunities that fit their style, budget and target audience.

### Information that contributed to developing the project idea
- Art of London (2023) Venues & places. https://artoflondon.co.uk/venues-and-places. (Accessed: 27 October 2025)
- Wile, G. (2025) West London Art Galleries. https://www.hortonandgarton.co.uk/blog/west-london-art-galleries/. (Accessed: 27 October 2025)
- Galleries in West London | Unique spaces for galleries (no date). https://hirespace.com/GB/London-Venue-Hire/West-London/Gallaries. (Accessed: 27 October 2025)
- Aurelia Art Studios (no date). https://www.tagvenue.com/venues/croydon/43709/aurelia-art-studios. (Accessed: 27 October 2025)
- Best Art Galleries & Exhibition Venues For Rent in London | Storefront - Best art Galleries & Exhibition Venues for rent in London | Storefront (no date). (Accessed: 27 October 2025)
- The 16 Best galleries for hire in London | Tagvenue UK (no date). https://www.tagvenue.com/hire/gallery-venue-hire/london. (Accessed: 27 October 2025)
- Local Artists | The Local Art Scene | The Local Art Scene (no date). https://thelocalartscene.co.uk/local-artists. (Accessed: 27 October 2025)

### Features
- User authentication for Artists and Venue Owners.
- Venue management with detailed listings (contact information, photos, price, address, size, availability).
- Interactive London map navigation with borough boundaries and responsive controls.
- Search and filtering by keyword, price, capacity, type and borough.
- Booking system with requests, notifications and secure payment integration.
- Favorites and reviews for artists and venue owners.

---

## Section 3 – Lean Canvas Model
During our group meetings, we successfully discussed the problem together and broke it down into smaller, manageable parts. Our teamwork was excellent and everyone contributed to developing the Lean Canvas. The main sections—Problem, Solution, Customer Segments and Existing Alternatives—were discussed collaboratively, as they required input from all members. The Cost Structure and Revenue Structure were suggested by Mikhail, the Unique Value Proposition and Unfair Advantage were developed by Zaara; the Key Metrics and High-Level Concept were prepared by Antonio; and the Channels and Early Adopters were contributed by Oleksandra. See Appendix for the full Lean Canvas table.

---

## Section 4 – Project Backlog

| Epic | US ID | As a .. | I want to .. | So that ... | F/NF/UI | Priority |
|---|---|---|---|---|---|---|
| User authentication | 001 | User (authentication) | Establish an account, using email/phone number and a secure password | I can gain authorised access to the platform's services. | F | High |
| | 002 | User (definition) | Be able to specify user type as Artist or Venue Owner | To ensure the platform interface and functionality align with user's operational needs. | F | High |
| | 003 | User (Artist) | Find financially accessible and proximate locations | To facilitate the selection and reservation of an optimal exhibition space. | F | High |
| | 004 | User (venue owner) | Publish detailed listings for available exhibition spaces. | To effectively market my venue and generate revenue through bookings. | UI | High |
| Venue management | 005 | User (Gallery Owner) | Provide comprehensive data about venue (contact information, high-quality photos, price, address, size, availability) | To provide Artists with full transparency and necessary details for informed decision-making. | F/UI | High |
| | 006 | User (Gallery owner) | Utilize an interactive calendar | To minimise booking conflicts and ensure Artists can accurately identify open dates. | F/UI | High |
| Venues map navigation | 007 | User (Artist) | Have an interactive London map interface (London boroughs) with responsive controls. | To rapidly visualise and locate suitable exhibition sites within a geographical area. | UI | High |
| | 008 | User (Artist) | Be able to search the places by keywords (gallery, coffee shop, warehouse, market, etc.) | To efficiently eliminate irrelevant results and refine spatial criteria. | F | High |
| | 009 | User (artist) | Apply comprehensive filters based on pricing, capacity, type and availability. | To optimise search efficiency and reduce time spent on venue procurement. | F | High |
| | 010 | User (artist) | View high-quality images, detailed descriptions and Owner contact information on the venue page | To conduct a thorough visual and logistical assessment prior to submitting a formal request. | UI | High |
| | 011 | User (artist) | Save preferred places to "Favorites" | I can take time to look for other options and compare them. | F | Medium |
| Booking system | 012 | User (Artist) | Initiate a booking by submitting a formal request including all details. | To clearly communicate logistical requirements and the nature of the event to the Venue Owner. | F | High |
| | 013 | User (Owner) | Receive reviews and notifications regarding 'Favourite' saves | To gauge market interest and the desirability of listed venue. | F | Medium |
| | 014 | User (Owner) | Receive real-time notifications for new booking requests with integrated accept/decline functionality | To maintain timely control over my venue's booking schedule and approval process. | F | High |
| | 015 | User (Artist) | Complete transactions using a secure payment integration | To guarantee the safety and validity of financial exchanges within the platform. | F | High |
| | 016 | User (Artist) | Request to modify or cancel a confirmed booking according to established policy | To retain scheduling flexibility aligned with my personal timetable. | F | Medium |
| Feedback (History) | 017 | User (Artist) | Receive performance reviews and a 5-star rating from the Venue Owner | To establish a positive reputation and build trust within the platform community. | F | Medium |
| | 018 | User (Owner) | Receive performance reviews and a 5-star rating from the Artist | To establish a positive operational track record and build credibility with prospective bookers. | F | Medium |

---

## Section 5 – First Sprint Plan

**Sprint Goal:** Building an interactive map of London that shows boroughs and a variety of placeholder locations of all kinds. Users should be able to modify their search results by applying filters like type (caffe, gallery, theatre, etc.), size, price and location on the map. The primary goal is to provide an appealing and engaging experience where users can quickly navigate the map and find the areas that best fit their needs.

**Sprint Leads:**
- **Product owner – Zaara Ahad:** Concentrates on "What". A stakeholder, the interested side in the business, represents the business and motivates the team to create the ideal project. Responsible for efficient Product backlog.
- **Scrum master – Oleksandra Denysenko:** Concentrates on "How". The team's main advisor controls the productivity of the group and makes sure it is optimal. Responsible for the efficiency of the team.

| US ID | User stories (What) | Points (Estimated effort) | To do (How) | Acceptance criteria (Expected) | Testing Result |
|---|---|---|---|---|---|
| 007 | **London map interface**<br>1. As an artist I want to easily navigate around webpage and boroughs with venue details so that I can easily find the best location for me.<br>2. As an owner I want to see my competitors and their venue details so that I can easily understand the market. | 13 | Implement a map service.<br>Apply the description to each venue location (name, address, etc.)<br>Create an interactive London map with each borough, which has zoom capabilities.<br>Apply logic to show the places | The website shows a London map, which can be easily zoomed and the user (artist) can see the details about the selected location. |  |
| 008 | **Search bar**<br>1. As an artist I want to search for a specific place so that I can easily sort out unnecessary places. | 5 | Develop search bar UI element.<br>Implement search logic to match the venue data. | Users can easily use the search bar and get the desired result. |  |
| 009 | **Filtering by criteria**<br>1. As an artist I want to filter venues by size, price, location, etc. so that I can spend less time on finding the correct option for me. | 5 | Develop the filter option UI element.<br>Implement logic for filtering (price range, size, type, borough). | To save time, users easily apply filters and sort out places in which they are not interested. |  |
| 005 | **Implement venue data**<br>1. As an artist I want to see a detailed description of the location so that I can understand if the place suits my requirements.<br>2. As an owner I want to provide the best description and photos of my venue so that my property is better advertised. | 8 | Research and finalise the scheme for the Venues database collection.<br>Document the final structure for coordinates and pricing fields. | The data for the map is successfully installed and accessed. |  |
| 001 | **Authentication**<br>1. As an artist, I want to create an account so that I can book a specific venue.<br>2. As an owner I want to create an account so that I can upload available venues. | 8 | Create a "Sign in"/"Log in" button UI element.<br>Develop the page for sign in/log in forms. | Users can create an account and choose the right type for them. |  |

---

## Section 6 – Sprint Backlog

### 007 – London Map Interface
**Acceptance criteria:**
- An interactive borough that shows a map of all London Boroughs.
- Zoom and pan functionality should be available on both desktop and mobile.
- Venue pins dynamically load from the database and name the key details, i.e, name, type, and address.

| Task ID | Description | Story point | Assigned to |
|---|---|---|---|
| 007-1 | Incorporate Leaflet.js /Map box API into frontend | 5 | Mikhail |
| 007-2 | Implement the borough boundary and map layers | 5 | Antonio |
| 007-3 | Fetch the venue from the backend and render pins dynamically | 8 | Zaara |
| 007-4 | For a mobile view, show an interactive map layout | 3 | Oleksandra |

### 008 – Search Bar
**Acceptance Criteria:**
- Users can search by keyword.
- Search is not case sensitive and supports partial matches.
- Search results update map markers dynamically.

| Task ID | Description | Story point | Assigned to |
|---|---|---|---|
| 008-1 | Build search bar UI component | 3 | Antonio |
| 008-2 | Implement search query filtering logic for the frontend. | 5 | Antonio |
| 008-3 | Connect the search input to the map markers display | 5 | Antonio |

### 009 – Filtering by Criteria
**Acceptance Criteria:**
- Users can filter by venue type, price, size, and borough.
- Filtered results update instantly on the map.
- Users can apply multiple filters simultaneously.

| Task ID | Description | Story point | Assigned to |
|---|---|---|---|
| 009-1 | Design the filter panel component (UI) | 3 | Zaara |
| 009-2 | Implement logic for applying multiple filters | 8 | Zaara |
| 009-3 | Test filter and map integration | 3 | Zaara |

### 005 – Implement Venue Data
**Acceptance Criteria:**
- Venue data includes the name, address, type, price, and coordinates.
- Should be stored securely in the database through the API endpoints.

| Task ID | Description | Story point | Assigned to |
|---|---|---|---|
| 005-1 | Define the Database schema for venues | 5 | Mikhail |
| 005-2 | Build REST API endpoints for venues | 5 | Mikhail |
| 005-3 | Populate the sample data for testing | 3 | Mikhail |

### 001 – Authentication
**Acceptance Criteria:**
- Users can sign up and log in securely.
- Login and registration interfaces are responsive and functional.

| Task ID | Description | Story point | Assigned to |
|---|---|---|---|
| 001-1 | Build user registration /login UI | 5 | Oleksandra |
| 001-2 | Implement authentication | 8 | Oleksandra |
| 001-3 | Connect frontend forms to backend API | 5 | Oleksandra |
| 001-4 | Unit test login/signup | 3 | Oleksandra |

Web pages:
- Hope page (About us) + 6. Catalogue (filtering page to search for actual location + booking)
- Venues map
- Registration + 4. Profile page (to make a post and look at others post)
- Discover upcoming events (if you book a venue, you can post it as an event, and let everyone un the community know, they don't have to create an account)

### 001 – Home Page (About Us)
**Acceptance Criteria:**
- An "About Us" section explaining the platform's mission.
- Featured sections highlighting how to use website, its purpose and why artists and owners should use it.
- Navigation to all other parts of the site.

| Task ID | Description | Story Points | Assigned to |
|---|---|---|---|
| 001-1 | Design and implement responsive section & main navigation | 5 | Zaara |
| 001-2 | Build "About Us" content section | 3 | Zaara |
| 001-3 | Create "Featured Venues" & "Featured Events" components | 5 | Zaara |

### 002 – Venues Map
**Acceptance criteria:**
- An interactive borough that shows a map of all London Boroughs.
- Zoom and pan functionality should be available on both desktop and mobile.
- Venue pins dynamically load from the database and name the key details, i.e, name, type, and address.

| Task ID | Description | Story point | Assigned to |
|---|---|---|---|
| 002-1 | Incorporate Leaflet.js /Map box API into frontend | 5 | Oleksandra |
| 002-2 | Implement the borough boundary and map layers | 5 | Oleksandra |
| 002-3 | Fetch the venue from the backend and render pins dynamically | 8 | Oleksandra |
| 002-4 | For a mobile view, show an interactive map layout | 3 | Oleksandra |
| 002-5 | Implement search bar, extra features and UI |  | Oleksandra |

### 003 – Authentication
**Acceptance Criteria:**
- Users can sign up and log in securely.
- Login and registration interfaces are responsive and functional.

| Task ID | Description | Story point | Assigned to |
|---|---|---|---|
| 003-1 | Build user registration /login UI | 5 | Mikhail |
| 003-2 | Implement authentication | 8 | Mikhail |
| 003-3 | Connect frontend forms to backend API | 5 | Mikhail |
| 003-4 | Unit test login/signup | 3 | Mikhail |

### 004 – Profile Page
**Acceptance Criteria:**
- Can be publicly accessed by community (people, who discover events)
- The purpose of profile for artists is to be able to create a little portfolio so the community can learn about them before visiting an artist's event.
- Users can view and edit their own profile details.
- Users can create, edit, and delete their own posts.
- A feed displays posts from other users.
- You can also see the history of user (rating)
- For owners to have a history and make add posts about their venues

| Task ID | Description | Story Points | Assigned to |
|---|---|---|---|
| 004-1 | Build profile view and edit form UI | 8 | Mikhail |
| 004-2 | Create UI components for making a post (title, description, media upload) | 8 | Mikhail |
| 004-3 | Implement the post feed on the profile page | 8 | Mikhail |
| 004-4 | Make it able to see yours and others profile | 8 | Mikhail |

### 005 – Catalogue (Filtering & Booking!)
**Acceptance Criteria:**
- A list/grid view of all venues with key details.
- Advanced filtering (by location, type, price, capacity, date availability).
- Search functionality.
- A booking process that comes with a calendar.

| Task ID | Description | Story Points | Assigned to |
|---|---|---|---|
| 005-1 | Build the venue list/grid view component | 5 | Zaara |
| 005-2 | Implement advanced filter sidebar and search bar | 8 | Zaara |
| 005-5 | Create the booking modal/UI with date picker and terms (to select available date and time) | 8 | Zaara |

### 006 – Discover Upcoming Events (MAKE IT public)
**Acceptance Criteria:**
- A list of upcoming events posted by users who have booked a venue.
- Clear distinction between own posts and others' posts.

| Task ID | Description | Story Points | Assigned to |
|---|---|---|---|
| 006-1 | Build the events list/grid view component | 5 | Antonio |
| 006-2 | Make it able only for User type – artist to make a post about upcoming event | 8 | Antonio |
| 006-3 | Provide direct navigation to user profiles from post interactions to see their profile | 8 | Antonio |

---

## Section 7 – Peer Review from the other startup

General Comments:
The project plan seems to be on point and really links to SDG 11, about sustainable cities and communities. The map-based platform which allows local artists to connect with venue owners is a relevant and even creative idea. The structure of the plan has good flow and it is noticeable that they have knowledge of how to use agile methods such as sprints or backlogs.

Clarity:
This project plan seems straightforward to use, and everyone's roles and responsibilities have been clearly specified. The Lean Canvas is good as it shows exactly who the users are and what is different about this idea when compared to other event platforms. The user stories are also really specific, particularly in the sections about map navigation, search and filtering. An improvement that could be done would be where the "success" part is, by making it a bit more measurable, by using goals for things like bookings for example. Furthermore, fixing things such as small typos and inconsistent labels can also improve clarity in the document.

What could be added:
The plan looks mainly complete, as it contains all the main parts needed. However, to strengthen it, a short section describing the potential risks (e.g. issues with map API, data privacy or payment systems). Another thing that could help would be to describe the tools and technologies planned to be used, so it is understood how it can be built. These small improvements could make the plan feel more suitable for the implementation.

Feasibility:
The first sprint goal is achievable and matches the project purpose really well, through building the map and adding search and filter features as a starting point. A suggestion is to have more complex features such as payments, be made in a later sprint instead. Another one would be to create a testing plan to show when the tasks are done, as this will make the flow of the project even better.

Conclusion:
Overall, the plan is solid and feasible with good flow, clear vision and good teamwork behind the scenes. By using the small improvements specified, such as risks, technical details and measurable goals, the plan would become even readier for the actual development.

---

## Appendix: Lean Canvas
Designed for: Unseen local creativity  
Designed by: Zaara Ahad  
Date: 23/10/2025  
Version: Final

| | | | | |
|---|---|---|---|---|
| **Problem** | **Solution** | **Unique Value Proposition** | **Unfair Advantage** | **Customer Segments** |
| - Lack of visibility/discoverability for local artists and organizers<br>- Lack of owned audience<br>- Fragmented event tools | - Map-based discovery<br>- Event publishing<br>- Social share<br>- Artist profiles/portfolios | A platform where artists and venues connect and collaborate on their creativity throughout an interactive map, which helps make local art visible and accessible. | Hyperlocal (working directly with small communities) and will start the platform with trusted local content. This is unfair because big event platforms like Eventbrite cannot easily establish those community ties. | - Local artists/organizers<br>- Independent venues<br>- Local audiences<br>- School/ university art societies |
| **Existing Alternatives** | **Key Metrics** | **High-Level Concept** | **Channels** | **Early Adopters** |
| - Facebook/ WhatsApp groups<br>- Instagram posts<br>- Eventbrite | - Active users<br>- Notification opt-ins<br>- New artist sign-ups<br>- Events published<br>- Notification opt-ins | - https://thelocalartscene.co.uk/local-artists<br>- a website that has incorporated both Google Maps and Eventbrite for local art and culture | - Community arts organizations<br>- Instagram/TikTok creators<br>- university campus societies<br>- pop-up exhibitions | - Emerging local artists<br>- University campus society<br>- Gallery owners |
| **Cost Structure** | | | | **Revenue Structure** |
| - Email/SMS<br>- Event moderation/customer support<br>- Maps usage<br>- Design/branding (advertising and social media marketing) | | | | - Sponsor blocks from venues<br>- Premium analytics for organizers<br>- Promoted events<br>- Affiliated partnerships/collaborations |
