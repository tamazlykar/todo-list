import { browser, $, protractor, ExpectedConditions, element, by, ElementFinder } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getPageTitle() {
    return browser.getTitle();
  }

  getHeading() {
    return $('h1.title').getText();
  }

  getTodoListView() {
    return $('app-todo-list');
  }

  getTodoListInput() {
    return this.getTodoListView().$('.header').$('input');
  }

  getTodos() {
    return this.getTodoListView().$$('app-todo-item');
  }

  getTodoCheckbox(todo: ElementFinder) {
    return todo.$('[type="checkbox"]');
  }

  getUrlMessage() {
    return $('.url-message').$$('p').first();
  }

  addTodo(title: string) {
    const input = this.getTodoListInput();
    input.sendKeys(title);
    input.sendKeys(protractor.Key.ENTER);
    // wait until todo will added on server
    browser.sleep(2000);
  }

  updateTodo(todo: ElementFinder, newTitle: string) {
    const label = todo.$('label');
    browser.actions().doubleClick(label).perform();

    const input = element(by.css('.edit'));
    browser.wait(ExpectedConditions.presenceOf(input));

    input.getAttribute('value').then(text => {
      for (let i = 0; i < text.length; i++) {
        input.sendKeys(protractor.Key.BACK_SPACE);
      }
    });
    input.sendKeys(newTitle);
    input.sendKeys(protractor.Key.ENTER);
    // wait until todo will updated on server
    browser.sleep(2000);
  }

  removeTodo(todo: ElementFinder) {
    const removeButton = todo.$('button');
    browser.actions().mouseMove(todo).perform();
    removeButton.click();
    // wait until todo will removed on server
    browser.sleep(1000);
  }
}
