document.addEventListener('DOMContentLoaded', function()  {
    const books = [];
    const RENDER_EVENT = 'render-book';
    const SAVED_EVENT = 'saved-book';
    const STORAGE_KEY = 'BOOKS_APP';

    const submitForm = document.getElementById('bookForm');
    submitForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addBook();
    });

    const searchForm = document.getElementById('searchBook');
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        document.dispatchEvent(new Event(RENDER_EVENT));
    });

    function addBook() {
        const bookTitle = document.getElementById('bookFormTitle').value;
        const bookAuthor = document.getElementById('bookFormAuthor').value;
        const bookYear = document.getElementById('bookFormYear').value; 
        const bookStatus = document.getElementById('bookFormIsComplete').checked;

        const generateID = generateId();
        const bookObject = generateBookObject(generateID, bookTitle, bookAuthor, bookYear, bookStatus);
        books.push(bookObject);

        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function generateId() {
        return +new Date();
    }

    function generateBookObject(id, title, author, year, isCompleted) {
        return {
            id,
            title,
            author,
            year,
            isCompleted
        }
    }

    document.addEventListener(RENDER_EVENT, function () {
        const searchQuery = document.getElementById('searchBookTitle').value.toLowerCase();
      
        // Filter books based on search query (or show all if query is empty)
        const filteredBooks = searchQuery ?
          books.filter((book) => book.title.toLowerCase().includes(searchQuery)) :
          books;
      
        // Clear existing book lists
        const incompleteBookList = document.getElementById('incompleteBookList');
        const completeBookList = document.getElementById('completeBookList');
        incompleteBookList.innerHTML = '';
        completeBookList.innerHTML = '';
      
        // Render filtered books (or all books if no search query)
        for (const bookItem of filteredBooks) {
          const bookElement = makeBook(bookItem);
          if (!bookItem.isCompleted) {
            incompleteBookList.append(bookElement);
          } else {
            completeBookList.append(bookElement);
          }
        }
      })

    function makeBook(bookObject) {
        const bookTitle = document.createElement('h3');
        bookTitle.classList.add('book-title');
        bookTitle.innerText = bookObject.title;
        
        const bookAuthor = document.createElement('p');
        bookAuthor.classList.add('book-year');
        bookAuthor.innerText = `Penulis: ${bookObject.author}`;
        
        const bookYear = document.createElement('p');
        bookYear.classList.add('book-year');
        bookYear.innerText = `Tahun: ${bookObject.year}`;

        const container = document.createElement('div');
        container.classList.add('item');
        container.append(bookTitle, bookAuthor, bookYear);
        container.setAttribute('id', `book-${bookObject.id}`);

        if (bookObject.isCompleted) {
            const incompleteButton = document.createElement('button');
            incompleteButton.classList.add('incomplete-button');
            incompleteButton.innerHTML = 'Belum selesai dibaca';

            incompleteButton.addEventListener('click', function() {
                incompleteBookFromComplete(bookObject.id);
            });

            const removeButton = document.createElement('button');
            removeButton.classList.add('remove-button');
            removeButton.innerText = 'Hapus buku';
            removeButton.addEventListener('click', function() {
                removeBook(bookObject.id);
            });

            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('button-container');
            buttonContainer.append(incompleteButton, removeButton);

            container.append(buttonContainer);
        } else {
            const completeButton = document.createElement('button');
            completeButton.classList.add('complete-button');
            completeButton.innerText = 'Sudah selesai dibaca';

            completeButton.addEventListener('click', function() {
                completeButtonFromIncomplete(bookObject.id);
            });

            const removeButton = document.createElement('button');
            removeButton.classList.add('remove-button');
            removeButton.innerText = 'Hapus buku';

            removeButton.addEventListener('click', function() {
                removeBook(bookObject.id);
            });

            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('button-container');
            buttonContainer.append(completeButton, removeButton);

            container.append(buttonContainer);
        }

        return container;
    }

    function incompleteBookFromComplete(bookId) {
        const bookTarget = findBook(bookId);

        if (bookTarget == null) return;

        bookTarget.isCompleted = false;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function completeButtonFromIncomplete(bookId) {
        const bookTarget = findBook(bookId);

        if (bookTarget == null) return;

        bookTarget.isCompleted = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function removeBook(bookId) {
        const bookTarget = findBookIndex(bookId);

        if (bookTarget == -1) return;

        books.splice(bookTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function findBook(bookId) {
        for (const bookItem of books) {
            if(bookItem.id == bookId) {
                return bookItem;
            }
        }
        return null;
    }

    function findBookIndex(bookId) {
        for (const index in books) {
            if (books[index].id == bookId) {
                return index;
            }
        }
        return -1;
    }

    function saveData() {
        if(isStorageExist) {
            const parsed = JSON.stringify(books);
            localStorage.setItem(STORAGE_KEY, parsed);
            document.dispatchEvent(new Event(SAVED_EVENT));
        }
    }

    function isStorageExist() {
        if(typeof (Storage) === undefined) {
            alert('Browser kamu tidak support local storage');

            return false;
        }

        return true;
    }

    function loadDataFromStorage() {
        const serializedData = localStorage.getItem(STORAGE_KEY);
        let data = JSON.parse(serializedData);

        if(data !== null) {
            for (const book of data) {
                books.push(book);
            }
        }

        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    if(isStorageExist) {
        loadDataFromStorage();
    }
})
