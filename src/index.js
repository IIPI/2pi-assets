var Assets = function()
{
	var queues = [];

	var currentQueueIndex = 0;
	var currentQueue;

	var that = this;
	var file = 0;


	function onFileComplete()
	{
		file++;
		// console.log("file loaded", file);
	}

	function onStartQueue(e)
	{
		// console.log("start new queue");
	}

	function onProgressQueue()
	{
		// console.log("progress");
	}

	function onCompleteQueue(e)
	{
		// console.log("load completed");
		loadNextQueue();
	}

	function loadNextQueue()
	{
		file = 0;
		currentQueueIndex++;

		if(currentQueueIndex < queues.length)
		{
			if(!queues[currentQueueIndex].queue.loaded)
				that.start();
			else
				loadNextQueue();
		}
		else
		{
			currentQueueIndex--;
		}
	}

	this.addQueue = function(name, files)
	{
		var queue = new createjs.LoadQueue(true)

		var total = files.length;
		for(var i = 0; i < total; i++)
		{
			queue.loadFile(files[i], false);
		}
		queue.addEventListener("complete", onCompleteQueue)
		queue.addEventListener("progress", onProgressQueue)
		queue.addEventListener("loadStart", onStartQueue)
		queue.addEventListener("fileload", onFileComplete);

		queues.push({queue:queue, name:name})

		return queue;
	}

	this.start = function(name, callback)
	{
		currentQueue = queues[currentQueueIndex];
		if(name)
		{
			var queue = _.findWhere(queues, {name: name});
			if(queue.queue.loaded)
			{
				if(callback)
				{
					callback()
					return queue.queue;
				}
			}

			if(currentQueue.name != queue.name)
			{
				currentQueue.queue.setPaused(true);
				currentQueue = queue;
				currentQueue.queue.setPaused(false);

				currentQueue.queue.removeEventListener("complete", onCompleteQueue);
				currentQueue.queue.addEventListener("complete", function()
				{
					currentQueueIndex--;

					loadNextQueue();

					if(callback)
						callback();
				});
				currentQueue.queue.load();
			}
			else
			{
				currentQueue.queue.removeEventListener("complete", onCompleteQueue);
				currentQueue.queue.addEventListener("complete", function()
				{
					loadNextQueue();

					if(callback)
						callback();
				});
        currentQueue.queue.load()
				return currentQueue.queue;
			}

		}
		else
		{
			currentQueue = queues[currentQueueIndex];
			currentQueue.queue.load();
		}
		return currentQueue.queue;
	}

	function customQueueComplete()
	{

	}
}

var assets = new Assets;

module.exports = assets;
