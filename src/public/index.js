const createForm = document.querySelector('#create-form');
const createInput = document.querySelector('#create-input');
const itemsList = document.querySelector('#items-list');

window.addEventListener('load', () => {
	const HTMLString = items.map((item) => getListItemTemplate(item)).join('');
	runReadOptimisticUpdate(HTMLString);
});

createForm.addEventListener('submit', async (event) => {
	event.preventDefault();

	const inputValue = createInput.value;

	try {
		validateInputText(inputValue);

		const response = await axios.post('/create-item', { text: inputValue });
		const item = response.data;

		runCreateOptimisticUpdate(item);

		runInputReset();
	} catch (error) {
		console.warn(error.message);
	}
});

function hydrateEditButtons() {
	const editButtons = document.querySelectorAll('.edit-button');

	editButtons.forEach((editButton) => {
		editButton.addEventListener('click', async () => {
			const listItem = editButton.parentElement.parentElement;
			const span = listItem.querySelector('.item-text');

			const userInput = prompt('Enter Your New Text', span.innerText);
			const itemId = editButton.getAttribute('data-item-id');

			try {
				validateInputText(userInput);

				await axios.post('/update-item', {
					text: userInput,
					id: itemId,
				});

				runEditOptimisticUpdate(span, userInput);
			} catch (error) {
				console.warn(error.message);
			}
		});
	});
}

function hydrateDeleteButtons() {
	const deleteButtons = document.querySelectorAll('.delete-button');

	deleteButtons.forEach((deleteButton) => {
		deleteButton.addEventListener('click', async (event) => {
			const listItem = deleteButton.parentElement.parentElement;
			const itemId = deleteButton.getAttribute('data-item-id');

			const userResponse = confirm(
				'Do you really want to delete this item permanently?',
			);

			try {
				validateConfirmation(userResponse);

				await axios.post('/delete-item', { id: itemId });

				runItemDeletion(listItem);
			} catch (error) {
				console.warn(error.message);
			}
		});
	});
}

function validateInputText(inputText) {
	const isInputEmpty = !inputText;

	if (isInputEmpty) {
		throw new Error('Input must not be empty.');
	}
}

function validateConfirmation(isItemDeleting) {
	if (!isItemDeleting) {
		throw new Error('Item deleting process cancelled.');
	}
}

function getListItemTemplate(item) {
	return `
         <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
            <span class="item-text">${item.text}</span>
            <div>
            <button data-item-id="${item._id}" class="edit-button btn btn-secondary btn-sm mr-1">Edit</button>
            <button data-item-id="${item._id}" class="delete-button btn btn-danger btn-sm">Delete</button>
            </div>
        </li>
    `;
}

function runInputReset() {
	createInput.value = '';
	createInput.focus();
}

function runReadOptimisticUpdate(htmlTemplate) {
	itemsList.insertAdjacentHTML('beforeend', htmlTemplate);

	hydrateEditButtons();
	hydrateDeleteButtons();
}

function runCreateOptimisticUpdate(item) {
	itemsList.insertAdjacentHTML('beforeend', getListItemTemplate(item));

	hydrateEditButtons();
	hydrateDeleteButtons();
}

function runEditOptimisticUpdate(element, newText) {
	element.innerText = newText;
}

function runItemDeletion(element) {
	element.remove();
}
