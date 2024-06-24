# Viridian Square

Welcome to Viridian Square - the natural meeting place for artists and art lovers!

Named after a well known artist pigment, Viridian green, the platform is tailored for the needs of artists and art lovers.

---

**Table of content**

- [Planning and methodology](#planning)
    - [Site goals and strategy](#strategy)
    - [Database ERD](#erd)
    - [API plan](#api-plan)
    - [Surface plane Design](#surface-plane-design)
        - [Colours](#colours)
        - [Fonts](#fonts)
        - [Logo](#logo)
        - [Low fidelity wireframes](#basic-wireframes)
        - [Design wireframes](#design-wireframes)
    - [Agile methodology](#agile-methodology)
    - [User stories](#user-stories)
    - [Future improvements](#future-improvements)
- [Features](#features)
- [Tools and technologies](#tools-and-technologies)
- [Repository description](#repo-description)
- [Deployment](#deployment)
- [Testing](#testing)
- [Bugs](#bugs)
- [Credits](#credits)
- [Acknowledgements](#acknowledgements)

---

<a id="planning"></a>
## Planning and methodology

<a id="strategy"></a>
## Site goals and strategy

Viridian sq. (Viridian square) provides a meeting place tailored for the needs of artists and art lovers.

Artists can set up their own gallery, presenting their art pieces in a visually appealing way, with relevant information. Artists also have the option to group art pieces into collections, so that related art pieces can be viewed together, as intended.

Art lovers can use the platform to discover their next find. They can search for art pieces by the works’ title, collection title, artist name, or hashtags. To make the search more efficient, they can also apply filters for art mediums used (eg. oil or watercolour), and sort the results.

If an art buyer finds what they are looking for, and the artist has indicated an interest in selling the piece, an enquiry can be made. If accepted, the artist’s contact details are shared with the potential buyer, connecting the two.

The goal of the site is to help independent artists to increase their visibility, and their chance to get their art noticed by potential buyers, while providing a dedicated platform for art lovers to discover new art and artists.

<a id="erd"></a>
### Database ERD
![Database ERD](documentation/erd/viridian_erd.png)

<a id="api-plan"></a>
### Plan for API
| Model | Endpoint | Create | Read | Update | Delete | Filter | Text search |
| - | - | - | - | - | - | - | - |
| users | users/<br>users/:id/ | Y | Y | Y | Y | N | N |
| profiles | profiles/<br>profiles/:id/ | Y (signals) | Y | Y | Y (signals) | N | N |
| artpieces | artpieces/<br>artpieces/:id/ | Y | Y | Y | Y | profile<br>liked<br>for_sale_status<br>collection<br>art_medium | title<br>collection title<br>profile name<br>hashtag |
| likes | likes/<br>likes/:id/ | Y | Y | N | Y | user | N |
| enquiries | enquiries/<br>enquiries/:id/ | Y | Y | Y | N | user<br>artpiece | N |
| hashtags | n/a | N | N | N | N | N | N |

<a id="surface-plane-design"></a>
### Surface plane design

<a id="colours"></a>
#### Colour scheme

Preliminary colour scheme: The primary brand colour, #40826, Viridian green, will be included. The other colours may be adjusted at a later stage in the project.

![Colour scheme](documentation/design/colour-scheme.png)

<a id="fonts"></a>
#### Fonts

![Oswald font](documentation/design/font-oswald.png)

For headings, and used in logo

![Heebo font](documentation/design/font-heebo.png)

For normal text


<a id="logo"></a>
#### Logo

Logo, black on transparent background:

![Logo](documentation/design/logo.webp)

<a id="basic-wireframes"></a>
#### Low fidelity wireframes
- [Desktop wireframes](documentation/wireframes/viridian-wireframes.pdf)
- [Tablet](documentation/wireframes/viridian-wireframes-tablet.pdf)
- [Mobile](documentation/wireframes/viridian-wireframes-mobile.pdf)

#### Design wireframes
An additional wireframe was created to test out the colour scheme and intended style of the website.

- [Design wireframe, home page (Discover page)](documentation/design/design-wireframe.pdf).

<a id="agile-methodology"></a>
### Agile methodologies
#### Sprint 1:
![Sprint 1 milestone](documentation/sprints/sprint1_milestone.png)

##### Sprint 1 wrap up:

Project board at end of sprint 1:

![End of sprint 1 project board](documentation/sprints/sprint1_board.png)

Points completed: 12

**Actions**
- Moved 6 PBI's back to the backlog.
- Reprioritised backlog.

<a id="user-stories"></a>
### User stories:

**Epics**

1. Navigation and structure
2. Accounts/Login
3. Showcasing art
4. Discovering art
5. Liking art pieces
6. Enquiring about art
7. Customising profile
8. Accessibility


#### Navigation and structure
- `Main navigation:`  As a __Site User__, I can __always see the main navigation options on the top of the page,__ so that I can __easily and intuitively find my way around the website__.
- `404 page:` As a __Site User__ I can __see an informative 404 page guiding me back to the main page if I visit a page that does not exist by mistake__ so that I can __easily get back to the home page with minimal disruption.__
- `Favicon:` As a __Site User__ I can __see the website's favicon__ so that I can __easily find the website if I have multiple tabs open__.

#### Accounts/Login
- `Account registration:` As a __Site User__, I can __register an account with a username and password__ so that I can __like art pieces, make enquiries, and set up a gallery.__
- `Account login:`  As a __registered Site User__, I can __log in__ so that I can __fully engage with the platform, by e.g. posting art or making enquiries__.
- `Account logout:` As a __Logged-in User__, I can __log out__ so that I can __feel safe in that others cannot access my credentials.__
- `Clear registration and login process:` As a __Site User__, I can see __clear instructions, and get feedback and/or confirmation__ when using the forms to register/login/log out, so that I can __sign up/log in without unnecessary problems and enjoy the experience.__

#### Showcasing art
- `Creating art pieces`: As a **logged-in user**, I can **create an art piece, including an image and details (e.g., title)**, so that I can **showcase my art.**
- `Updating art pieces`: As a **logged-in user**, I can **update my own art piece**, so that I can **manage my own content**.
- `Deleting art pieces`: As a **logged-in user**, I can **delete my own art piece**, so that I can **manage and be in control of my own content.**
- `CRUD collections`: As a **logged-in user**, I can **create, update and delete collections**, so that I can **group related art pieces and present my art in a way that makes sense to me.**
- `Adding tags to art pieces`: As a **logged-in user**, I can **add tags to my own art piece**, so that I can **increase the searchability of my art**.

#### Discovering art
- `Viewing an artist's profile/gallery page`: As a **Site User**, I can **visit an artist's profile page/gallery page**, so that I can **view all art pieces and collections published by the artist in one place.**
- `Viewing popular/trending art pieces`:  As a **Site User**, I can **see popular/trending art pieces in a dedicated section on the discovery page** so that **I can get inspired to engage further and discover new great pieces.**
- `Searching for art pieces`: As a **Site User**, I can **search based on artist, title, collection title, and tags**, so that I can **find art pieces matching my criteria.**
- `Infinite scrolling for listed art pieces`: As a **Site User viewing a large number of art pieces in a list, the list is shown using infinite scroll**, so that **I do not need to navigate to separate pages**.
- `Filtering art pieces`: As a **Site User**, I can **filter the art pieces in a list view** so that I can **more easily find the pieces I am looking for and narrow down the results.**
- `Sorting art pieces`: As a **Site User**, I can **sort the art pieces in a list view (search results)** so that I can **more easily find the pieces I am looking for.**
- `Viewing art piece collection`: As a **Site User viewing an individual art piece**, I can **see if the art piece belongs to a collection**, so that I can **easily find art pieces similar to the one I am viewing.**
- `Viewing a single art piece`: As a **Site User**, I can **click on an art piece in a list** so that I can **see a detailed view of the art piece.**

#### Liking art pieces
- `Liking an art piece`: As a **logged-in site user**, I can **like an art piece**, so that I can **show appreciation to the artist and so that I can more easily find my way back to art pieces I enjoy.**
- `Removing a like from an art piece`: As a **logged-in site user who has liked an art piece**, I can **remove my like**, so that I can **change my mind or correct my mistake.**
- `Viewing liked art pieces`:  As a **logged-in site user**, I can **visit the “Liked” page**, so that I can **view all art pieces that I have liked.**

#### Enquiring about art
- `Making an enquiry`: As a **logged-in site user viewing an art piece which has been marked as for sale by the artist**, I can **make an enquiry**, so that I can **express my wish to connect with the artist.**
- `Viewing enquiries`: As a **logged-in site user who has made/received an enquiry**, I can **view the enquiry and its status on the enquiries page**, so that I can **keep track of my enquiries.**
- `Responding to enquiries`: As a **logged-in site user who has received an enquiry from a potential buyer**, I can **respond to the enquiry on the enquiries page**, so that I can **decide if my contact details will be shared with the potential buyer.**

#### Customising profile
- `Customising the profile page:` As a **logged-in user**, I can **customise my profile page/gallery page**, so that I can **better present who I am as an artist/art buyer.**

#### Accessibility
- `Navigate the website with keyboard`: As a **Site User not able to utilise a mouse** I can **focus on and access all interactive elements on the website using a keyboard** so that I can **be included, navigate on the website, access the content, and use all core functionality**.

<a id="credits"></a>
## Credits

- [Customising the user model - Django documentation](https://docs.djangoproject.com/en/5.0/topics/auth/customizing/#a-full-example)