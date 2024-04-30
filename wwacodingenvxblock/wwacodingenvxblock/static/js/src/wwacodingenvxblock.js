/* eslint-env jquery */

/* Javascript for WWACodingEnvXBlock. */
// eslint-disable-next-line no-unused-vars
function WWACodingEnvXBlock (runtime, element) {
  function updateCount (result) {
    $('.count', element).text(result.count)
  }

  function updateLineNumbers () {
    const lineCount = $('#thecodingarea').children().length
    // if ($('#thecodingarea').contents().first()[0].nodeType === 3) {
    //   lineCount += 1
    // }
    let lineNumbers = ''
    for (let i = 1; i <= lineCount; i++) {
      lineNumbers += i + '\n'
    }
    $('#lines').text(lineNumbers)
  }

  const handlerUrl = runtime.handlerUrl(element, 'increment_count')

  $('.demo', element).click(function (eventObject) {
    $.ajax({
      type: 'POST',
      url: handlerUrl,
      data: JSON.stringify({ hello: 'world' }),
      success: updateCount
    })
  })

  $('.button-run', element).click(function (eventObject) {
    const code = $('#thecodingarea').text()
    const outputArea = $('.output')
    const errorArea = $('.error')
    const exitCodeArea = $('.exitCode')

    console.info('code:', code)
    console.info('stringified:', JSON.stringify({ user: 'Talon', code }))
    const data = JSON.stringify({ user: 'Talon', code })

    $.ajax({
      type: 'POST',
      url: 'http://localhost:5000/runcsharp',
      contentType: 'application/json',
      data,
      success: function (response) {
        outputArea.html(response.output.replace(/\n/g, '<br/>'))
        errorArea.html(response.error.replace(/\n/g, '<br/>'))
        exitCodeArea.text(response.exitCode)
      },
      error: function (error) {
        const { responseJSON } = error
        console.log('data:', data)
        console.error(error)
        outputArea.html(responseJSON?.output.replace(/\n/g, '<br/>'))
        errorArea.html(responseJSON.error.replace(/\n/g, '<br/>'))
        exitCodeArea.text(responseJSON?.exitCode)
      }
    })
  })

  $('#thecodingarea', element).on('input', updateLineNumbers)

  // <div id="thecodingarea" contenteditable></div>
  $('#thecodingarea', element).on('keydown', function (e) {
    // Tab should insert 4 spaces
    if (e.keyCode === 9) {
      e.preventDefault()
      const selection = window.getSelection()
      const range = selection.getRangeAt(0)
      const tabNode = document.createTextNode('\u00a0\u00a0\u00a0\u00a0')
      range.insertNode(tabNode)

      // Move the cursor
      range.setStartAfter(tabNode)
      range.setEndAfter(tabNode)
      selection.removeAllRanges()
      selection.addRange(range)
    }

    // Shift+Tab should remove 2 preceding spaces from the current line
    // or the current selection
    if (e.shiftKey && e.keyCode === 9) {
      // e.preventDefault()
      console.log('Shift+Tab pressed')
      // ToDo
    }

    // Enter should insert a newline and indent the next line if the current line is indented
    /* if (e.keyCode === 13) {
      e.preventDefault()

      const selection = window.getSelection()
      const range = selection.getRangeAt(0)
      const nodeContent = range.startContainer.textContent
      const currentLine = nodeContent
        .slice(0, range.startOffset)
        .split('\n')
        .pop()

      // Count the leading spaces
      const leadingSpaces = currentLine.match(/^(\s*)/)[0]

      // Create a new div with the same indentation
      const newDiv = document.createElement('div')
      newDiv.innerHTML = leadingSpaces.replace(/ /g, '&nbsp;')

      $('#thecodingarea').append(newDiv)

      // Move the cursor to the end of the inserted div
      range.setStart(newDiv, 1)
      range.collapse(true)
      selection.removeAllRanges()
      selection.addRange(range)

      updateLineNumbers()
    } */

    // Entering ( or [ or { should automatically insert the closing character
    // and move the cursor inside the brackets
    if (e.key === '(' || e.key === '[' || e.key === '{' || e.key === '"' || e.key === "'") {
      e.preventDefault()

      const selection = window.getSelection()
      const range = selection.getRangeAt(0)

      // Determine the closing bracket
      let closingBracket
      switch (e.key) {
        case '(':
          closingBracket = ')'
          break
        case '[':
          closingBracket = ']'
          break
        case '{':
          closingBracket = '}'
          break
        case '"':
          closingBracket = '"'
          break
        case "'":
          closingBracket = "'"
          break
      }

      // Create a document fragment to hold the opening bracket, cursor, and closing bracket
      const fragment = document.createDocumentFragment()
      fragment.appendChild(document.createTextNode(e.key))
      const cursorNode = document.createTextNode(closingBracket)
      fragment.appendChild(cursorNode)

      // Insert the fragment at the cursor position
      range.insertNode(fragment)

      // Move the cursor inside the brackets
      range.setStartBefore(cursorNode)
      range.setEndBefore(cursorNode)
      selection.removeAllRanges()
      selection.addRange(range)
    }

    // Syntax highlighting
  })

  $(function ($) {
    /* Here's where you'd do things on page load. */
    updateLineNumbers()
  })
}
