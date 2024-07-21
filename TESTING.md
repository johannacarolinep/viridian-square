# Testing

**Table of content**
- [Browser compatibility testing](#browser-compatibility)
- [Responsiveness testing](#responsiveness)
- [Manual testing](#manual-testing)
    - [Manual testing of core functionality](#manual-test-functionality)
    - [Manual testing of user stories](#user-story-testing)
- [Automated tests](#automated-tests)
    - [Django unit tests](#unittests)
    - [Jest tests for JavaScript](#jest-tests)
- [Lighthouse tests](#lighthouse)
- [Validation of HTML](#html-validation)
- [Validation of CSS](#css-validation)
- [Linting of Python code](#python-lint)
- [Linting of JavaScript code](#js-lint)

<a id="browser-compatibility"></a>
## Browser compatibility testing

<details>
<summary>Chrome</summary>

</details>

<details>
<summary>Safari</summary>


</details>

<details>
<summary>Microsoft Edge</summary>

</details>

<details>
<summary>Firefox</summary>

</details>

<a id="responsiveness"></a>
## Responsiveness testing


<a id="manual-testing"></a>
## Manual testing TBC

<a id="manual-test-functionality"></a>
### Manual testing of core functionality TBC

### Manual testing of user stories WIP

<a id="automated-tests"></a>
## Automated tests

<a id="unittests"></a>
### Django unit tests

<details> 
<summary>Click for details relating to Django rest unit tests</summary>

</details>

<a id="jest-tests"></a>
### Jest tests

<details>
<summary>Click for details relating to Jest tests</summary>

</details>

<a id="lighthouse"></a>
## Lighthouse tests

<details>
<summary>Click to see screenshots of test results on mobile</summary>

</details>

<details>
<summary>Click to see screenshots of test results on desktop</summary>

</details>

<a id="html-validation"></a>
## Validation of HTML

All pages were validated using [W3C's Markup Validation Service](https://validator.w3.org/nu/), with no errors or warnings.

Due to how React renders HTML elements, it did not make much sense to validate by URL. Instead, I have taken the following steps for each page on the website:

1. Inspect the page
1. Right-click on the HTML tag and select "Edit as HTML" in the "Elements" tab.
    - ![Edit as HTML](documentation/html_validate/html_validate_edit.png)
1. Copy all of the rendered HTML.
    -  ![Copy all rendered HTML](documentation/html_validate/html_validate_copy.png)
1. Validate by direct input in the validation tool.
    - ![Validate by direct input](documentation/html_validate/html_validate_direct_input.png)

This allowed for the validation of conditionally rendered HTML.

Since the screenshot does not indicate which page is being validated, I will not include a screenshot per page.

The following pages were validated, with no errors or warnings:

- "/" - Discover (Home page)
- "/artpieces/:id/ Artpiece page
- "/profiles/:id/ Profile page
- "/profiles/:id/edit/ Profile edit page
- "/account/" Account admin page
- "/artpieces/create/" Artpiece creation page
- "/collections/create/" Collection creation page
- "/artpieces/:id/edit/" Artpiece edit page
- "/collections/:id/edit" Collection edit page
- "/enquiries/" Enquiries page
- "/liked/" Liked page 
- "/signin/" Sign in page
- "/signup/" Sign up page


<a id="css-validation"></a>
## Validation of CSS

<details>
<summary>Click to see CSS validation details</summary>


</details>

<a id="python-lint"></a>
## Linting of Python code

<a id="js-lint"></a>
## Linting of JS and JSX code

<details>
<summary>Click to see screenshots of linting results per file</summary>

</details>