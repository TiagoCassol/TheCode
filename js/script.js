window.addEventListener('load', setInitialMode);

function setInitialMode() {
  const darkModeToggle = document.querySelector('#change-theme');
  const changeContrastToggle = document.querySelector('#change-contrast');
  const texts = document.querySelectorAll('.text');

  const darkMode = localStorage.getItem('darkMode');
  if (darkMode === 'true') {
    doDarkMode();
    darkModeToggle.checked = true;
  } else {
    darkModeToggle.checked = false;
  }

  const contrastMode = localStorage.getItem('contrastMode');
  if (contrastMode === 'true') {
    doHighContrastMode();
    changeContrastToggle.checked = true;
  } else {
    changeContrastToggle.checked = false;
  }

  const alignment = localStorage.getItem('alignment');
  if (alignment === 'left') {
    for (const text of texts) {
      text.style.textAlign = 'left';
    }
  } else if (alignment === 'center') {
    for (const text of texts) {
      text.style.textAlign = 'center';
    }
  } else if (alignment === 'justify') {
    for (const text of texts) {
      text.style.textAlign = 'justify';
    }
  }

  const initialFontSize = localStorage.getItem('fontSize');
  if (initialFontSize === 'sm') {
    for (const h1 of h1s) {
      h1.style.fontSize = '22px';
    }
    for (const h2 of h2s) {
      h2.style.fontSize = '18px';
    }
    for (const h3 of h3s) {
      h3.style.fontSize = '14px';
    }
    for (const p of ps) {
      p.style.fontSize = '14px';
    }
    for (const span of spans) {
      span.style.fontSize = '14px';
    }
  } else if (initialFontSize === 'md') {
    for (const h1 of h1s) {
      h1.style.fontSize = '24px';
    }
    for (const h2 of h2s) {
      h2.style.fontSize = '20px';
    }
    for (const h3 of h3s) {
      h3.style.fontSize = '16px';
    }
    for (const p of ps) {
      p.style.fontSize = '16px';
    }
    for (const span of spans) {
      span.style.fontSize = '16px';
    }
  } else if (initialFontSize === 'lg') {
    for (const h1 of h1s) {
      h1.style.fontSize = '28px';
    }
    for (const h2 of h2s) {
      h2.style.fontSize = '24px';
    }
    for (const h3 of h3s) {
      h3.style.fontSize = '20px';
    }
    for (const p of ps) {
      p.style.fontSize = '20px';
    }
    for (const span of spans) {
      span.style.fontSize = '18px';
    }
  }
}

//Cookies
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}

function getCookie(cname) {
  let name = cname + '=';
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

function checkCookie() {
  let user = getCookie('username');
  if (user != '') {
    alert('Welcome again ' + user);
  } else {
    user = prompt('Please enter your name:', '');
    if (user != '' && user != null) {
      setCookie('username', user, 365);
    }
  }
}
// Modals
const settingsModalButton = document.querySelector('#settings-button');
const settingsCloseModalButton = document.querySelector(
  '#settings-close-button'
);
const settingsModal = document.querySelector('#settings-modal');
const aboutModalButton = document.querySelector('#about-button');
const aboutCloseModalButton = document.querySelector('#about-close-button');
const aboutModal = document.querySelector('#about-modal');
const fade = document.querySelector('#fade');

const toggleSettingsModal = () => {
  [settingsModal, fade].forEach((element) => element.classList.toggle('hide'));
};

[settingsModalButton, settingsCloseModalButton].forEach((element) => {
  element.addEventListener('click', () => toggleSettingsModal());
});

const toggleAboutModal = () => {
  [aboutModal, fade].forEach((element) => element.classList.toggle('hide'));
};

[aboutModalButton, aboutCloseModalButton].forEach((element) => {
  element.addEventListener('click', () => toggleAboutModal());
});

// Change Lightmode vs Darkmode
const changeThemeButton = document.querySelector('#change-theme');
const html = document.querySelector('html');
const icons = document.querySelectorAll('.icon');

const getStyle = (element, style) =>
  window.getComputedStyle(element).getPropertyValue(style);

const lightColors = {
  base1: getStyle(html, '--base1'),
  base2: getStyle(html, '--base2'),
  base3: getStyle(html, '--base3'),
  base35: getStyle(html, '--base35'),
  base4: getStyle(html, '--base4'),
  textColor: getStyle(html, '--text-color'),
};

const darkColors = {
  base1: '#465A63',
  base2: '#42545E',
  base3: '#3B4B54',
  base35: '#37434b',
  base4: '#2D3A40',
  textColor: '#fff',
};

const transformKey = (key) =>
  '--' + key.replace(/([A-Z])/, '-$1').toLowerCase();

const changeColors = (colors) => {
  Object.keys(colors).map((key) =>
    html.style.setProperty(transformKey(key), colors[key])
  );
  for (const icon of icons) {
    icon.classList.toggle('icon-darkmode');
  }
};

const doDarkMode = () => {
  changeColors(darkColors);
  setDarkMode(true);
};

const doLightMode = () => {
  changeColors(lightColors);
  setDarkMode(false);
};

changeThemeButton.addEventListener('change', ({ target }) => {
  target.checked ? doDarkMode() : doLightMode();
});

function setDarkMode(state) {
  localStorage.setItem('darkMode', state);
}

//High Contrast
const changeContrastButton = document.querySelector('#change-contrast');

const normalcolorsMode = {
  blue: getStyle(html, '--blue'),
  green: getStyle(html, '--green'),
  yellow: getStyle(html, '--yellow'),
  orange: getStyle(html, '--orange'),
  red: getStyle(html, '--red'),
};

const colorblindMode = {
  blue: '#785EF0',
  green: '#648FFF',
  yellow: '#FFB000',
  orange: '#FE6100',
  red: '#DC267F',
};

const changeContrast = (colors) => {
  Object.keys(colors).map((key) =>
    html.style.setProperty(transformKey(key), colors[key])
  );
};

const doHighContrastMode = () => {
  changeContrast(colorblindMode);
  setContrastMode(true);
};

const doNormalContrastMode = () => {
  changeContrast(normalcolorsMode);
  setContrastMode(false);
};

changeContrastButton.addEventListener('change', ({ target }) => {
  target.checked ? doHighContrastMode() : doNormalContrastMode();
});

function setContrastMode(state) {
  localStorage.setItem('contrastMode', state);
}

//Alignment
const texts = document.querySelectorAll('.text');

if (document.alignGroup) {
  document.alignGroup.onclick = function () {
    var alignValue = document.querySelector(
      'input[name="alignOption"]:checked'
    ).value;
    if (alignValue === 'left') {
      for (const text of texts) {
        text.style.textAlign = 'left';
      }
      setAlignment('left');
    } else if (alignValue === 'center') {
      for (const text of texts) {
        text.style.textAlign = 'center';
      }
      setAlignment('center');
    } else if (alignValue === 'justify') {
      for (const text of texts) {
        text.style.textAlign = 'justify';
      }
      setAlignment('justify');
    }
  };

  function setAlignment(state) {
    localStorage.setItem('alignment', state);
  }
}

if (document.difficultyGroup) {
  document.difficultyGroup.onclick = function () {
    let difficulty = document.querySelector(
      'input[name="difficultyOption"]:checked'
    ).value;

    localStorage.setItem('difficulty', difficulty);
  };
}

// Font size
const h1s = document.querySelectorAll('h1');
const h2s = document.querySelectorAll('h2');
const h3s = document.querySelectorAll('h3');
const ps = document.querySelectorAll('p');
const spans = document.querySelectorAll('span');

document.fontSizeGroup.onclick = function () {
  var fontSizeValue = document.querySelector(
    'input[name="fontSize"]:checked'
  ).value;
  if (fontSizeValue === 'sm') {
    for (const h1 of h1s) {
      h1.style.fontSize = '22px';
    }
    for (const h2 of h2s) {
      h2.style.fontSize = '18px';
    }
    for (const h3 of h3s) {
      h3.style.fontSize = '14px';
    }
    for (const p of ps) {
      p.style.fontSize = '14px';
    }
    for (const span of spans) {
      span.style.fontSize = '14px';
    }
    setFontSize('sm');
  } else if (fontSizeValue === 'md') {
    for (const h1 of h1s) {
      h1.style.fontSize = '24px';
    }
    for (const h2 of h2s) {
      h2.style.fontSize = '20px';
    }
    for (const h3 of h3s) {
      h3.style.fontSize = '16px';
    }
    for (const p of ps) {
      p.style.fontSize = '16px';
    }
    for (const span of spans) {
      span.style.fontSize = '16px';
    }
    setFontSize('md');
  } else if (fontSizeValue === 'lg') {
    for (const h1 of h1s) {
      h1.style.fontSize = '28px';
    }
    for (const h2 of h2s) {
      h2.style.fontSize = '24px';
    }
    for (const h3 of h3s) {
      h3.style.fontSize = '20px';
    }
    for (const p of ps) {
      p.style.fontSize = '20px';
    }
    for (const span of spans) {
      span.style.fontSize = '18px';
    }
    setFontSize('lg');
  }
};

function setFontSize(state) {
  localStorage.setItem('fontSize', state);
}
