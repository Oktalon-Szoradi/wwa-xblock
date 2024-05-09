/* eslint-env jquery */
/* global ace */

/* Javascript for WWACodingEnvXBlock. */

const CSHARP_HELLO_WORLD = `using System;

// This is a comment!

public class HelloWorld
{
    public static void Main(string[] args)
    {
        Console.WriteLine("Hallo, Wien West Akademie!");
    }
}
`

// eslint-disable-next-line no-unused-vars
function WWACodingEnvXBlock (runtime, element) {
  $('.button-run', element).click(function (eventObject) {
    const code = ace.edit('editor').getValue()
    const outputArea = $('.output')
    const errorArea = $('.error')
    const exitCodeArea = $('.exitCode')

    console.info('code:', code)
    console.info('stringified:', JSON.stringify({ user: 'Talon', code }))
    const data = JSON.stringify({ user: 'Talon', code })

    $('.button-run').prop('disabled', true)
    $('.spinner').addClass('fade-in')
    setTimeout(() => {
      $('.spinner').removeClass('fade-in')
    }, 500)
    $('.spinner').removeClass('hidden')

    $.ajax({
      type: 'POST',
      url: 'http://localhost:5000/runcsharp',
      contentType: 'application/json',
      data,
      success: function (response) {
        outputArea.html(response.output.replace(/\n/g, '<br/>'))
        errorArea.html(response.error.replace(/\n/g, '<br/>'))
        exitCodeArea.text(response.exitCode)
        $('.button-run').prop('disabled', false)
        $('.spinner').addClass('fade-out')
        setTimeout(() => {
          $('.spinner').removeClass('fade-out')
        }, 500)
        $('.spinner').addClass('hidden')
      },
      error: function (error) {
        errorArea.html(`An error occurred! Check the browser console.
        <br>If you're seeing this, then it usually means that the server is not running, ran into an error, or sent an unparsable response.
        <br>Please reload the page.
        `)
        const { responseJSON } = error
        console.log('data:', data)
        console.error('error:', error)
        outputArea.html(responseJSON?.output?.replace(/\n/g, '<br>'))
        errorArea.html(responseJSON.error.replace(/\n/g, '<br>'))
        exitCodeArea.text(responseJSON?.exitCode)
        $('.button-run').prop('disabled', false)
        $('.spinner').addClass('fade-out')
        setTimeout(() => {
          $('.spinner').removeClass('fade-out')
        }, 500)
        $('.spinner').addClass('hidden')
      }
    })
  })

  $(function ($) {
    /* Here's where you'd do things on page load. */
    const editor = ace.edit('editor')
    editor.setShowPrintMargin(false)
    editor.setTheme('ace/theme/chaos')
    editor.session.setMode('ace/mode/csharp')

    editor.setValue(CSHARP_HELLO_WORLD, 1)
  })
}
