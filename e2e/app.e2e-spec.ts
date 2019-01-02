import { browser, ExpectedConditions, $ } from 'protractor';
import { AppPage } from './app.po';

const expectedTitle = 'TodoList';
const expectedHeading = 'TODO List';
const todoTitle = 'Check this app';

describe('Todo List App', () => {
  let page: AppPage;

  beforeAll(() => {
    page = new AppPage();
    page.navigateTo();
  });

  describe('Initial page', () => {
    it(`has title ${expectedTitle}`, () => {
      expect(page.getPageTitle()).toBe(expectedTitle);
    });
    it(`has heading ${expectedHeading}`, () => {
      expect(page.getHeading()).toBe(expectedHeading);
    });
    it('has todo list view', () => {
      const view = page.getTodoListView();
      expect(view.isPresent()).toBeTruthy();
      expect(view.isDisplayed()).toBeTruthy();
    });
  });

  describe('Todo tests', () => {
    beforeAll(() => {
      browser.waitForAngularEnabled(false);
    });

    it('can add Todo and generate unique list', () => {
      const urlMessage = page.getUrlMessage();
      expect(urlMessage.isPresent()).toBeFalsy();

      page.addTodo(todoTitle);
      const todos = page.getTodos();
      browser.wait(ExpectedConditions.presenceOf($('app-todo-item')));

      expect(todos.count()).toBe(1);
      expect(todos.first().getText()).toBe(todoTitle);

      browser.wait(ExpectedConditions.presenceOf(urlMessage));
      expect(urlMessage.isPresent()).toBeTruthy();
      expect(urlMessage.getText()).toContain(browser.getCurrentUrl());
    });
    it('can update Todo', () => {
      const todos = page.getTodos();
      browser.wait(ExpectedConditions.presenceOf($('app-todo-item')));
      const todo = todos.get(0);
      page.updateTodo(todo, 'testMe');

      expect(todos.count()).toBe(1);
      expect(todos.first().getText()).toBe('testMe');
    });
    it('can toggle todo\'s done status', () => {
      browser.wait(ExpectedConditions.presenceOf($('app-todo-item')));

      const todo = page.getTodos().get(0);
      const todoCheckbox = page.getTodoCheckbox(todo);

      expect(todoCheckbox.isSelected()).toBe(false);
      todoCheckbox.click();
      expect(todoCheckbox.isSelected()).toBe(true);
      todoCheckbox.click();
      expect(todoCheckbox.isSelected()).toBe(false);
    });
    it('can remove Todo', () => {
      browser.wait(ExpectedConditions.presenceOf($('app-todo-item')));

      const todos = page.getTodos();
      expect(todos.count()).toBe(1);
      const todo = todos.get(0);
      page.removeTodo(todo);
      expect(todos.count()).toBe(0);
    });
  });
});
