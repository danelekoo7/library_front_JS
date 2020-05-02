document.addEventListener("DOMContentLoaded", function () {
    const tbody = document.querySelector("tbody");


    function addBookToDom(book) {
        const row = document.createElement("tr");
        const title = document.createElement("td");
        const titleAnchor = document.createElement("a");
        const divElement = document.createElement("div");

        titleAnchor.dataset.id = book.id;
        titleAnchor.innerText = book.title;
        title.appendChild(titleAnchor);

        titleAnchor.addEventListener("click", function () {
            $.getJSON({
                url: `http://localhost:8080/books/${this.dataset.id}`,
            }).done(response => {
                console.log('response' + response);
                var book = JSON.parse(JSON.stringify(response));
                divElement.innerText = 'typ: ' + book.type + '\n' +
                    'isbn: ' + book.isbn;
            })
        });

        const author = document.createElement("td");
        author.innerText = book.author;

        const publisher = document.createElement("td");
        publisher.innerText = book.publisher;

        const removeTD = document.createElement("td");
        const removeA = document.createElement("a");
        removeA.innerText = "remove";
        removeA.dataset.id = book.id;
        removeA.className = "remove";
        removeTD.appendChild(removeA);

        row.appendChild(title);
        row.appendChild(author);
        row.appendChild(publisher);
        row.appendChild(removeTD);

        tbody.appendChild(row);
        tbody.appendChild(divElement)
    }


    $("#addBookForm").submit(function (event) {
        event.preventDefault();

        var title = $("#title").val();
        var author = $("#author").val();
        var publisher = $("#publisher").val();
        var isbn = $("#isbn").val();
        var type = $("#type").val();

        const newBook = {
            "isbn": isbn,
            "title": title,
            "author": author,
            "publisher": publisher,
            "type": type
        };

        $.post({
            url: "http://localhost:8080/books",
            data: JSON.stringify(newBook),
            headers: {
                'Content-Type': 'application/json'
            }
        }).done(() => {
            location.reload(false);
        }).fail(() => {
                alert("nie podałeś + ");
            console.log("Nie udało się dodać książki")
        });
    });


    // ASYNCHRONICZNOŚĆ
    $.get({
        url: "http://localhost:8080/books"
    }).done(response => {
        response.forEach(addBookToDom);
        console.log(response);
    });


    var removeElement = $('tbody');
    removeElement.on('click', '.remove', function () {
        console.log('product clicked');
        var id = this.dataset.id;
        console.log(id);
        $.ajax({
            url: "http://localhost:8080/books/" + id,
            method: "DELETE"
        }).done(() => {
            location.reload(false);
        });
    });
});