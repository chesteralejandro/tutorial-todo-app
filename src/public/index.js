const editButtons = document.querySelectorAll('.edit-button');
const deleteButtons = document.querySelectorAll('.delete-button');

editButtons.forEach((editButton) => {
	editButton.addEventListener('click', async () => {
		const listItem = editButton.parentElement.parentElement;
		const span = listItem.querySelector('.item-text');

		const userInput = prompt('Enter Your New Text', span.innerText);
		const itemId = editButton.getAttribute('data-item-id');

		try {
			validateInputText(userInput);

			await axios.post('/update-item', { text: userInput, id: itemId });

			runOptimisticUpdate(span, userInput);
		} catch (error) {
			console.warn(error.message);
		}
	});
});

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

function runOptimisticUpdate(element, newText) {
	element.innerText = newText;
}

function runItemDeletion(element) {
	element.remove();
}
