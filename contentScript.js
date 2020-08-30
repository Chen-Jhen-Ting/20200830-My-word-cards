let detectingTranslationBubble;
const detectTranslationBubble = (timesToTry, resolve) => {
  if (timesToTry <= 0) return;
  detectingTranslationBubble = setTimeout(() => {
    const bubble = document.querySelector('.jfk-bubble');
    if (bubble) {
      resolve(bubble);
    } else {
      detectTranslationBubble(timesToTry - 1, resolve);
    }
  }, 500);
};

const waitForTranslationBubble = () => new Promise(resolve => {
  clearTimeout(detectingTranslationBubble);
  detectTranslationBubble(10, resolve);
})

const addWord = (word, definition) => {
  chrome.storage.local.get(['words'], result => {
    chrome.storage.local.set({ words: {
      ...result.words,
      [word]: definition,
    }})
  });
}

const formTemplate = document.createElement('template');
formTemplate.innerHTML = `
  <style>
    hr {
      margin-top: 1.25rem;
    }
    input {
      margin: 0.25rem 0;
    }
    input[type=text] {
      width: 96%;
    }
    input[type=submit] {
      width: 100%;
    }
  </style>
  <form>
    <br>
    <hr>
    <label>詞語:</label>
    <input type='text' name='word' placeholder='詞語'>
    <br>
    <label>定義:</label>
    <input type='text' name='definition' placeholder='請選取/輸入定義'>
    <br>
    <input type='submit' value='新增字卡'>
  </form>
`;

// ============================================================================
let formContainer;
document.addEventListener('click', async ()=>{
  const selected = window.getSelection().toString()
  if (!selected){ return }

  if(formContainer && formContainer.parentNode.isConnected){
    formContainer.shadowRoot.querySelector('input[name=definition]').value = selected
  }else{
  const bubble = await waitForTranslationBubble()

  formContainer = document.createElement('div')
  const shadow = formContainer.attachShadow({mode: 'open'})//需要 shadow 是因為不希望被網站原本的css js 影響
  const templateCloned = document.importNode(formTemplate.content,true)

  shadow.appendChild(templateCloned)
  bubble.appendChild(formContainer)

  const form = shadow.querySelector('form')
  form.querySelector('input[name=word]').value = selected

  form.addEventListener('submit',event=>{
    event.preventDefault()
    const word =form.querySelector('input[name=word]').value
    const definition =form.querySelector('input[name=definition]').value

    addWord(word,definition)

    const submitBtm = form.querySelector('[type=submit]')
    submitBtm.disabled = true
    submitBtm.value = '已新增'


  })
  }
})