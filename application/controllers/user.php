<?php if (!defined('BASEPATH')) die();

class User extends Main_Controller {

	public function index()
	{
		$this->load->model("user_model");
		print(json_encode($this->user_model->getAll()));
		return;
	}

	public function getNearLocation()
	{
		$this->load->model("user_model");
		print(json_encode($this->user_model->getNearLocation(
			$_GET["lat"],
			$_GET["lng"],
			$_GET["radius"]
		)));
		return;
	}
}

/* End of file user.php */
/* Location: ./application/controllers/user.php */
