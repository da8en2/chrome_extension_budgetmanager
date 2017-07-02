var contextMenuItem = {
  "id": "spendMoney",
  "title": "spendMoney",
  "contexts": ["selection"]
};

chrome.contextMenus.create(contextMenuItem);

function isInt(value) {
  return !isNaN(value) &&
    parseInt(Number(value)) == value &&
    !isNaN(parseInt(value, 10));
}

chrome.contextMenus.onClicked.addListener(function(clickData) {
  if (clickData.menuItemId == "spendMoney" && clickData.selectionText) {
    if (isInt(clickData.selectionText)) {
      chrome.storage.sync.get(['total', 'limit'], function(budget) {
        var newTotal = 0;
        if (budget.total) {
          newTotal += parseInt(budget.total);
        }
        newTotal += parseInt(clickData.selectionText);
        chrome.storage.sync.set({'total': newTotal}, function(){
          if (newTotal >= budget.limit) {
            var notifOptions = {
              type: "basic",
              iconUrl: "icon48.png",
              title: "Spending limit reached!",
              message: "You have reached you're limit!"
            };
            chrome.notifications.create('limitNotif', notifOptions);
          }
        });
      });
    }
  }
});
