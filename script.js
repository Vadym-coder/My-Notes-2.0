let notes = []

function loadNotes() {
  const savedNotes = localStorage.getItem("notes")
  if (savedNotes) {
    notes = JSON.parse(savedNotes)
    $('#notlist').empty()
    notes.forEach(note => {
      const crossedClass = note.crossed ? ' crossed' : ''
      $('#notlist').append(`
        <li class="date">${note.date}</li>
        <li class="first${crossedClass} not-item"><b>${note.heading}</b>
        <div class="note-buttons">
          <button class="butdel button"><span class="material-symbols-outlined">🗑️</span></button>
          <button class="cross button"><span class="material-symbols-outlined">✅</span></button>
          <button class="edit button"><span class="material-symbols-outlined">📝</span></button>
        </div>
        </li>
        <li class="second${crossedClass} not-item">${note.text}</li>
      `)
    })
  }
}

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes))
}

function absentlist() {
  if ($('#notlist').children().length === 0) {
    $('#emptyMsg').show()
  } else {
    $('#emptyMsg').hide()
  }
}

$(document).ready(function () {
  loadNotes()
  absentlist()

  $('#add').click(function () {
    const inputnot1 = $('#inputnot1').val().trim()
    const inputnot2 = $('#inputnot2').val()
    if (inputnot1 === "") {
      alert("Please fill in the bottom input.")
      $('#inputnot1, #inputnot2').val("")
      return
    }
    if (!inputnot2) {
      alert("Please select a category.")
      $('#inputnot1, #inputnot2').val("")
      return
    }

    if ($(this).text() === "Save") {
      const editIndex = $(this).data("editIndex")
      if (editIndex !== undefined) {
        notes[editIndex].heading = inputnot2.charAt(0).toUpperCase() + inputnot2.slice(1)
        notes[editIndex].text = inputnot1
        saveNotes()
        $('#notlist').empty()
        loadNotes()
        absentlist()
        $('#add').text("Add").removeData("editIndex")
        $('#inputnot1, #inputnot2').val("")
        return
      }
    }

    let note = {
      "heading": inputnot2.charAt(0).toUpperCase() + inputnot2.slice(1),
      "text": inputnot1,
      "date": parseDate(),
      "crossed": false
    }

    notes.push(note)
    saveNotes()
    $('#notlist').empty()
    loadNotes()
    absentlist()
    $('#inputnot1, #inputnot2').val("")
  })

  $('#notlist').on('click', '.butdel', function () {
    const $delone = $(this).closest('.first')
    const $deltwo = $delone.next('.second')
    const $delthree = $delone.prev('.date')

    const headingToDelete = $delone.find('b').text()
    const textToDelete = $deltwo.text()
    const dateToDelete = $delthree.text()

    notes = notes.filter(note => !(note.heading === headingToDelete && note.text === textToDelete && note.date === dateToDelete))
    saveNotes()

    $delone.remove()
    $deltwo.remove()
    $delthree.remove()
    absentlist()
  })

  $('#notlist').on('click', '.cross', function () {
    const $delone = $(this).closest('.first')
    const $deltwo = $delone.next('.second')

    const headingToToggle = $delone.find('b').text()
    const textToToggle = $deltwo.text()
    const dateToToggle = $delone.prev('.date').text()

    const noteIndex = notes.findIndex(note =>
      note.heading === headingToToggle &&
      note.text === textToToggle &&
      note.date === dateToToggle
    )

    if (noteIndex !== -1) {
      notes[noteIndex].crossed = !notes[noteIndex].crossed
      saveNotes()
    }

    $delone.toggleClass("crossed")
    $deltwo.toggleClass("crossed")
  })

  $('#notlist').on('click', '.edit', function () {
    const $p = $(this).closest('.first');
    const $s = $p.next();
    if ($p.next().hasClass('edit-form')) return;

    $s.after(`
      <div class="edit-form">
        <select class="inputnot2 styled-select" required>
          <option value="" disabled>Select category</option>
          <option value="urgent">Urgent</option>
          <option value="not-urgent">Not Urgent</option>
          <option value="homework">Homework</option>
          <option value="job">Job</option>
          <option value="personal">Personal</option>
          <option value="shopping">Shopping</option>
          <option value="appointment">Appointment</option>
          <option value="others">Others</option>
        </select>
        <input value="${$s.text()}" class="input" style="width: 300px;">
        <button class="button save-edit">Save</button>
      </div>
    `);

  const currentHeading = $p.find('b').text().trim().toLowerCase().replace(/\s+/g, '-');
  $p.next().next().find('select.inputnot2').val(currentHeading);
});

  $('#notlist').on('click', '.save-edit', function () {
    const $form = $(this).parent()
    const $headingInput = $form.find('select.inputnot2').eq(0)
    const $textInput = $form.find('input').eq(0)

    const newHeading = $headingInput.val()
    const newText = $textInput.val().trim()

    if (!newHeading || !newText) {
      alert('Both heading and text are required.')
      return
    }

    const $second = $form.prev()
    const $first = $second.prev()
    const $date = $first.prev()

    const oldHeading = $first.find('b').text().trim()
    const oldText = $second.text()
    const oldDate = $date.text()

    const noteIndex = notes.findIndex(note =>
      note.heading === oldHeading &&
      note.text === oldText &&
      note.date === oldDate
    )

    if (noteIndex !== -1) {
      notes[noteIndex].heading = newHeading.charAt(0).toUpperCase() + newHeading.slice(1)
      notes[noteIndex].text = newText
      saveNotes()
    }

    $first.find('b').text(newHeading.charAt(0).toUpperCase() + newHeading.slice(1))
    $second.text(newText)

    $form.remove()
  })

  $('#toggleDark').click(function () {
    $('body').toggleClass('dark')
    if ($('body').hasClass('dark')) {
      $(this).text('☀️')
    } else {
      $(this).text('🌕')
    }
  })
})

function parseDate() {
  const date = new Date()
  const y = date.getFullYear()
  const d = date.getDate()
  const m = date.getMonth() + 1
  const ht = date.getHours()
  const mt = date.getMinutes()
  const st = date.getSeconds()

  return `${d}/${m}/${y} ${ht}:${mt}:${st}`
}
