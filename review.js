const cardTemplate = document.createElement("template");
cardTemplate.innerHTML = `
  <div class='card'>
    <button class='button button-delete'>X</button>
    <p class='word'></p>
    <p class='definition'></p>
  </div>
`;

// ============================================================================

window.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["words"], (result) => {
    const words = Object.keys(result.words || {});
    const wordscount = words.length
    document.getElementById("words-count").textContent = wordscount;
    
    Object.entries(result.words || {})
    .forEach( pair =>{
      const cardDOM = document.importNode(cardTemplate.content,true)
      cardDOM.querySelector('.word').textContent = pair[0]
      cardDOM.querySelector('.definition').textContent = pair[1]

      const cardDiv = cardDOM.querySelector('.card')

      cardDOM.querySelector('.button-delete').addEventListener('click',()=>{
        delete result.words[pair[0]]
        chrome.storage.local.set({words:result.words})
        cardDiv.remove()
        wordscount -= 1
        document.getElementById("words-count").textContent = wordscount
      })

      document.getElementById('cards').appendChild(cardDOM)
    })
    

    const cards = document.getElementById('cards')
    cards.addEventListener('click',()=>{
      chrome.storage.local.set({words:{}})
      wordscount = 0
      document.getElementById('words-count').textContent = wordscount
      cards.innerHTML = ""
    })
  });
});
