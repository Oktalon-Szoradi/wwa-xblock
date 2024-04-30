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

  function doSyntaxHighlighting () {
    const KEYWORDS = [
      'abstract',
      'as',
      'base',
      'bool',
      'break',
      'byte',
      'case',
      'catch',
      'char',
      'checked',
      'class',
      'const',
      'continue',
      'decimal',
      'default',
      'delegate',
      'do',
      'double',
      'else',
      'enum',
      'event',
      'explicit',
      'extern',
      'false',
      'finally',
      'fixed',
      'float',
      'for',
      'foreach',
      'goto',
      'if',
      'implicit',
      'in',
      'int',
      'interface',
      'internal',
      'is',
      'lock',
      'long',
      'namespace',
      'new',
      'null',
      'object',
      'operator',
      'out',
      'override',
      'params',
      'private',
      'protected',
      'public',
      'readonly',
      'ref',
      'return',
      'sbyte',
      'sealed',
      'short',
      'sizeof',
      'stackalloc',
      'static',
      'string',
      'struct',
      'switch',
      'this',
      'throw',
      'true',
      'try',
      'typeof',
      'uint',
      'ulong',
      'unchecked',
      'unsafe',
      'ushort',
      'using',
      'virtual',
      'void',
      'volatile',
      'while'
    ]
    const CONTEXTUAL_KEYWORDS = [
      'add',
      'and',
      'alias',
      'ascending',
      'args',
      'async',
      'await',
      'by',
      'descending',
      'dynamic',
      'equals',
      'file',
      'from',
      'get',
      'global',
      'group',
      'init',
      'into',
      'join',
      'let',
      'managed',
      'nameof',
      'nint',
      'not',
      'notnull',
      'nuint',
      'on',
      'or',
      'orderby',
      'partial',
      'record',
      'remove',
      'required',
      'scoped',
      'select',
      'set',
      'unmanaged',
      'value',
      'var',
      'when',
      'where',
      'with',
      'yield'
    ]
    const elementToSyntaxHighlight = $('#thecodingarea')

    // Go thru each div and syntax highlight it
    elementToSyntaxHighlight.children().each(function (index, element) {
      const text = element.textContent
      let newText = text

      // Highlight keywords
      KEYWORDS.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g')
        newText = newText.replace(
          regex,
          `<span class="keyword">${keyword}</span>`
        )
      })

      // Highlight contextual keywords
      CONTEXTUAL_KEYWORDS.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g')
        newText = newText.replace(
          regex,
          `<span class="contextual-keyword">${keyword}</span>`
        )
      })

      // Save the current selection
      const sel = window.getSelection()
      const range = sel.rangeCount > 0 ? sel.getRangeAt(0) : null

      // Update the text of the element
      if (newText !== text) {
        element.innerHTML = newText
      }

      // Restore the selection
      if (range) {
        sel.removeAllRanges()
        sel.addRange(range)
      }
    })
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

  $('#thecodingarea', element).on('input', function () {
    updateLineNumbers()
  })

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

    // #region Unused

    // Shift+Tab should remove 2 preceding spaces from the current line
    // or the current selection
    if (e.shiftKey && e.keyCode === 9) {
      // e.preventDefault()
      console.log('Shift+Tab pressed')
      // ToDo
    }

    // // Backspace should remove 4 spaces if there are 4 spaces at the cursor
    // if (e.keyCode === 8) {
    //   const cursorPos = window.getSelection().getRangeAt(0).startOffset
    //   const textBeforeCursor = this.textContent.substring(0, cursorPos)
    //   console.log('textBeforeCursor:', textBeforeCursor)
    //   console.log(textBeforeCursor.endsWith('    '))
    //   if (textBeforeCursor.endsWith('\u00a0\u00a0\u00a0\u00a0')) {
    //     e.preventDefault()
    //     this.textContent =
    //       textBeforeCursor.slice(0, -4) + this.textContent.substring(cursorPos)
    //     const range = document.createRange()
    //     const sel = window.getSelection()
    //     range.setStart(this.childNodes[0], cursorPos - 4)
    //     range.collapse(true)
    //     sel.removeAllRanges()
    //     sel.addRange(range)
    //   }
    // }

    // // Pressing space should always insert a nbsp
    // if (e.keyCode === 32) {
    //   e.preventDefault()
    //   const selection = window.getSelection()
    //   const range = selection.getRangeAt(0)
    //   const spaceNode = document.createTextNode('\u00a0')
    //   range.insertNode(spaceNode)

    //   // Move the cursor
    //   range.setStartAfter(spaceNode)
    //   range.setEndAfter(spaceNode)
    //   selection.removeAllRanges()
    //   selection.addRange(range)
    // }

    // // Enter should insert a newline and indent the next line if the current line is indented
    // if (e.keyCode === 13) {
    //   e.preventDefault()

    //   const selection = window.getSelection()
    //   const range = selection.getRangeAt(0)
    //   const nodeContent = range.startContainer.textContent
    //   const currentLine = nodeContent
    //     .slice(0, range.startOffset)
    //     .split('\n')
    //     .pop()

    //   // Split the text at the cursor position
    //   const textBeforeCursor = nodeContent.slice(0, range.startOffset)
    //   const textAfterCursor = nodeContent.slice(range.startOffset)

    //   // Count the leading spaces
    //   const leadingSpaces = currentLine.match(/^(?:&nbsp;)*/)[0]
    //   console.log('leadingSpaces.length:', leadingSpaces.length)

    //   // Create a new div with the same indentation and the text after the cursor
    //   const newDiv = document.createElement('div')
    //   newDiv.innerHTML = leadingSpaces.replace(/ /g, '&nbsp;') + textAfterCursor
    //   if (leadingSpaces.length === 0) {
    //     newDiv.innerHTML = '<br>' + textAfterCursor
    //   }

    //   // Get the parent div of the current selection
    //   let parentDiv = range.startContainer
    //   while (
    //     parentDiv.parentNode &&
    //     parentDiv.parentNode.id !== 'thecodingarea'
    //   ) {
    //     parentDiv = parentDiv.parentNode
    //   }

    //   // Insert the new div after the parent div
    //   if (parentDiv.nextSibling) {
    //     parentDiv.parentNode.insertBefore(newDiv, parentDiv.nextSibling)
    //   } else {
    //     parentDiv.parentNode.appendChild(newDiv)
    //   }

    //   // Update the text in the current div to the text before the cursor
    //   range.startContainer.textContent = textBeforeCursor

    //   // Move the cursor to the end of the inserted div
    //   range.setStart(newDiv.firstChild, leadingSpaces.length)
    //   range.collapse(true)
    //   selection.removeAllRanges()
    //   selection.addRange(range)

    //   updateLineNumbers()
    // }

    // #endregion

    // Entering ( or [ or { should automatically insert the closing character
    // and move the cursor inside the brackets
    if (
      e.key === '(' ||
      e.key === '[' ||
      e.key === '{' ||
      e.key === '"' ||
      e.key === "'"
    ) {
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
  })

  $(function ($) {
    /* Here's where you'd do things on page load. */
    updateLineNumbers()
    doSyntaxHighlighting()
  })
}
