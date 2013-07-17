<?php if (!defined('BASEPATH')) die();

class Search extends Main_Controller {

	public function location($lat, $lng, $d)
	{
		$this->load->model("user_model");
		print(json_encode($this->user_model->getNearLocation($lat, $lng, $d)));
		return;
	}
}

/* End of file user.php */
/* Location: ./application/controllers/user.php */
