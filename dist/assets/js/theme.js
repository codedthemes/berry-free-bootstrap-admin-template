/**
=========================================================================
=========================================================================
Template Name: Berry - Admin Template
Author: CodedThemes
Support: https://codedthemes.com/
File: themes.js
Description:  this file will contains overall theme setup and handle
              behavior of live custumizer like Dark/Light, LTR/RTL,
              preset color, theme layout, theme contarast etc.
=========================================================================
=========================================================================
*/

'use strict';

var rtl_flag = false;
var dark_flag = false;

document.addEventListener('DOMContentLoaded', function () {
  if (typeof Storage !== 'undefined') {
    layout_change(localStorage.getItem('layout'));
  }
});

function layout_change_default() {
  // Determine the initial theme based on system preferences
  let darkLayout = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  layout_change(darkLayout); // Apply the selected layout

  // Activate the "default" layout button, if it exists
  const defaultBtn = document.querySelector('.theme-layout .btn[data-value="default"]');
  if (defaultBtn) {
    defaultBtn.classList.add('active');
  }

  // Listen for changes in the user's system color scheme and update the layout accordingly
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    darkLayout = event.matches ? 'dark' : 'light';
    layout_change(darkLayout); // Apply the new layout when the preference changes
  });
}

// dark switch mode
function dark_mode() {
  const darkModeToggle = document.getElementById('dark-mode');

  // Ensure the element exists before proceeding
  if (!darkModeToggle) return;

  // Toggle between dark and light modes based on the checkbox status
  const mode = darkModeToggle.checked ? 'dark' : 'light';
  layout_change(mode);
}

// preset color
document.addEventListener('DOMContentLoaded', function () {
  const presetColors = document.querySelectorAll('.preset-color > a');
  if (presetColors.length) {
    presetColors.forEach((colorElement) => {
      colorElement.addEventListener('click', function (event) {
        let targetElement = event.target;

        // Traverse up to find the correct clickable element
        if (targetElement.tagName === 'SPAN') {
          targetElement = targetElement.parentNode;
        } else if (targetElement.tagName === 'IMG') {
          targetElement = targetElement.closest('a');
        }

        const presetValue = targetElement.getAttribute('data-value');
        preset_change(presetValue);
      });
    });
  }

  // Initialize SimpleBar if .pct-body exists
  const pctBody = document.querySelector('.pct-body');
  if (pctBody) {
    new SimpleBar(pctBody);
  }

  // Handle layout reset
  const layoutResetBtn = document.querySelector('#layoutreset');
  if (layoutResetBtn) {
    layoutResetBtn.addEventListener('click', () => location.reload());
  }

  // Select all layout buttons
  const layoutButtons = document.querySelectorAll('.theme-layout .btn');

  // Add click event listeners to each layout button
  layoutButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation(); // Prevent event bubbling

      // Get the target element, accounting for nested <span> clicks
      let target = event.target;
      while (target.tagName === 'SPAN') {
        target = target.parentNode;
      }

      // Determine the layout value and store it in localStorage
      const layoutValue = target.getAttribute('data-value') === 'true' ? 'light' : 'dark';
      localStorage.setItem('layout', layoutValue);
    });
  });
});

function font_change(name) {
  const fontUrls = {
    Roboto: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap',
    Poppins: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap',
    Inter: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap'
  };

  // Set the font stylesheet link
  const src = fontUrls[name] || '';
  document.querySelector('#main-font-link').setAttribute('href', src);

  // Apply the font family to the body
  document.body.style.fontFamily = `"${name}", sans-serif`;

  // Update the font selection radio button, if the off-canvas control exists
  const control = document.querySelector('.pct-offcanvas');
  if (control) {
    const radio = document.querySelector(`#layoutfont${name}`);
    if (radio) {
      radio.checked = true;
    }
  }
}

function layout_caption_change(value) {
  const isActive = value === 'true';

  // Update the body attribute based on the selected value
  document.body.setAttribute('data-pc-sidebar-caption', isActive ? 'true' : 'false');

  // Find and deactivate the currently active button, if any
  const activeButton = document.querySelector('.theme-nav-caption .btn.active');
  if (activeButton) {
    activeButton.classList.remove('active');
  }

  // Activate the new button based on the selected value
  const targetButton = document.querySelector(`.theme-nav-caption .btn[data-value='${value}']`);
  if (targetButton) {
    targetButton.classList.add('active');
  }
}

function preset_change(value) {
  const body = document.querySelector('body');
  const control = document.querySelector('.pct-offcanvas');

  // Set the 'data-pc-preset' attribute on the body
  body.setAttribute('data-pc-preset', value);

  // Update active state in the UI if control exists
  if (control) {
    const activeElement = document.querySelector('.preset-color > a.active');
    const newActiveElement = document.querySelector(`.preset-color > a[data-value='${value}']`);

    if (activeElement) {
      activeElement.classList.remove('active');
    }
    if (newActiveElement) {
      newActiveElement.classList.add('active');
    }
  }
}

function layout_rtl_change(value) {
  const body = document.querySelector('body');
  const html = document.querySelector('html');
  const directionControl = document.querySelector('.theme-direction .btn.active');
  const rtlBtn = document.querySelector(".theme-direction .btn[data-value='true']");
  const ltrBtn = document.querySelector(".theme-direction .btn[data-value='false']");

  if (value === 'true') {
    rtl_flag = true;
    body.setAttribute('data-pc-direction', 'rtl');
    html.setAttribute('dir', 'rtl');
    html.setAttribute('lang', 'ar');

    // Update active button state for RTL
    if (directionControl) directionControl.classList.remove('active');
    if (rtlBtn) rtlBtn.classList.add('active');
  } else {
    rtl_flag = false;
    body.setAttribute('data-pc-direction', 'ltr');
    html.removeAttribute('dir');
    html.removeAttribute('lang');

    // Update active button state for LTR
    if (directionControl) directionControl.classList.remove('active');
    if (ltrBtn) ltrBtn.classList.add('active');
  }
}

function layout_change(layout) {
  const isDark = layout === 'dark';
  document.body.setAttribute('data-pc-theme', layout);

  // Update button states
  const activeBtn = document.querySelector('.theme-layout .btn.active');
  if (activeBtn) activeBtn.classList.remove('active');

  const newActiveBtn = document.querySelector(`.theme-layout .btn[data-value='${!isDark}']`);
  if (newActiveBtn) newActiveBtn.classList.add('active');

  // Set the flag for the dark mode
  dark_flag = isDark;

  // Update logo images based on the layout
  const logoPaths = isDark ? '../assets/images/logo-white.svg' : '../assets/images/logo-dark.svg';

  const landingLogoPath = isDark ? 'assets/images/logo-white.svg' : 'assets/images/logo-dark.svg';

  const logoSelectors = [
    '.pc-sidebar .m-header .logo-lg',
    '.navbar-brand .logo-lg',
    '.navbar-brand .brand-logo',
    '.navbar-brand .landing-logo',
    '.auth-main .brand-logo',
    '.footer-top .footer-logo'
  ];

  // Loop through the selectors and update their logos
  logoSelectors.forEach((selector) => {
    const element = document.querySelector(selector);
    if (element) {
      const src = selector.includes('landing-logo') ? landingLogoPath : logoPaths;
      element.setAttribute('src', src);
    }
  });
}

function change_box_container(value) {
  const content = document.querySelector('.pc-content');
  const footerWrapper = document.querySelector('.footer-wrapper');
  const activeControl = document.querySelector('.theme-container > a.active');

  // Check if content and footer elements exist
  if (content && footerWrapper) {
    const isBoxed = value === 'true';

    // Helper function to toggle class names
    function toggleContainer(isBoxed) {
      if (isBoxed) {
        content.classList.add('container');
        footerWrapper.classList.add('container');
        footerWrapper.classList.remove('container-fluid');
      } else {
        content.classList.remove('container');
        footerWrapper.classList.remove('container');
        footerWrapper.classList.add('container-fluid');
      }
    }

    toggleContainer(isBoxed);

    // Update active button class
    if (activeControl) {
      activeControl.classList.remove('active');
      const newActive = document.querySelector(`.theme-container > a[data-value='${value}']`);
      if (newActive) {
        newActive.classList.add('active');
      }
    }
  }
}
