/* eslint-env jquery */

/* Javascript for WWACodingEnvXBlock. */
// eslint-disable-next-line no-unused-vars
function WWACodingEnvXBlock (runtime, element) {
  function updateCount (result) {
    $('.count', element).text(result.count)
  }

  function updateLineNumbers () {
    let lineCount = $('#thecodingarea').children().length
    // Node.TEXT_NODE = 3
    if ($('#thecodingarea').contents().first()[0].nodeType === 3) {
      lineCount += 1
    }
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
    const code = $('#thecodingarea').val()
    const outputArea = $('.output')
    const errorArea = $('.error')
    const exitCodeArea = $('.exitCode')

    /*
    let output = '...'
    try {
      output = eval(code)
    } catch (e) {
      console.error(e)
      outputarea.text(e)
    }
    outputarea.text(output)
    */

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
    }

    // Shift+Tab should remove 2 preceding spaces from the current line
    // or the current selection
    if (e.shiftKey && e.keyCode === 9) {
      e.preventDefault()
      // ToDo
    }

    // Enter should insert a newline and indent the next line if the current line is indented
    // Enter should also put closing brackets on its own new line

    // Entering ( or [ or { should automatically insert the closing character

    // Syntax highlighting
  })

  $(function ($) {
    /* Here's where you'd do things on page load. */
    updateLineNumbers()
  })
}
