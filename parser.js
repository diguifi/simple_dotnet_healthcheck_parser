let jsonString;
let jsonParsed;

// chrome
try {
  const jsonChrome = document.getElementsByTagName("pre");
  jsonString = jsonChrome[0].innerHTML;
} catch { console.log('not chrome') }

// edge (doesnt work properly with big outputs because edge wants to be cool and lazy loads jsons)
if (!jsonString) {
  try {
    const allDivs = document.getElementsByTagName("div");
    const elWithJson = Array.from(allDivs).find(x => x.dataset.language == 'json')
    const jsonEdge = elWithJson.innerText;
    jsonString = jsonEdge;
  } catch { console.log('not edge') }
}

try {
  jsonParsed = JSON.parse(jsonString);
  fillHealthChecks();
} catch (e) { console.log('couldnt load json') }

function fillHealthChecks() {
  try
  {
    const style = document.createElement('link');
    style.id = 'parser-style';
    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.href = chrome.runtime.getURL('parser.css');
    (document.head||document.documentElement).appendChild(style);

    const general = document.createElement("p");
    const parent = document.createElement("ul");
    parent.classList.add('flex-container');
    document.body.replaceChildren(general, parent)

    parent.replaceChildren()
    const obj = jsonParsed
    general.innerHTML = `General health: ${obj.status.toLowerCase() == 'healthy' ? 'Healthy ✔️' : 'Unhealthy ❌'}`
    for (const [key, value] of Object.entries(obj.entries)) {
      const item = document.createElement('li')
      const parent2 = document.createElement('ul')
      const name = document.createElement('li')
      const health = document.createElement('li')
      item.className += `flex-item-${obj.entries[key].status.toLowerCase()}`
      parent2.className += 'flex-container-2'
      name.className += 'flex-item-name'
      health.className += 'flex-item-health'

      name.textContent = `${key}:`
      health.textContent = `${obj.entries[key].status}`

      parent2.appendChild(name)
      parent2.appendChild(health)
      item.appendChild(parent2)
      parent.appendChild(item)
    }
  }
  catch(err) { console.log(err) }
}
